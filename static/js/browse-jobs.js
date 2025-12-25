const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            allJobs: [],

            // 1. ADDED: Search Query State
            searchQuery: '',

            filters: {
                type: [],
                city: [],
                category: [],
                company: [],
                // NEW: salary range
                salaryMin: 0,
                salaryMax: 100000
            },

            // Pagination
            page: 1,
            pageSize: 12,

            // Modal & Notification States
            showApplyModal: false,
            selectedJobForApp: null,
            newCvName: null,
            showLoginNotification: false,
            isApplying: false,
            showSuccessNotification: false,
            successMessage: ''
        }
    },

    computed: {
        filteredJobs() {
            // Start with all jobs
            let result = this.allJobs;

            // 1. SEARCH FILTER (New Logic)
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                result = result.filter(job =>
                    job.title.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q)
                );
            }

            // SALARY RANGE FILTER
            const min = this.filters.salaryMin;
            const max = this.filters.salaryMax;
            result = result.filter(job => {
                const s = this.parseSalary(job.salary);
                // If salary cannot be parsed, include by default
                if (s == null) return true;
                return s >= min && s <= max;
            });

            // 2. CHECKBOX FILTERS
            // If no checkboxes are selected, return the result (which might already be filtered by search)
            if (this.filters.type.length === 0 &&
                this.filters.city.length === 0 &&
                this.filters.category.length === 0 &&
                this.filters.company.length === 0) {
                return result;
            }

            // Apply Checkbox Logic
            return result.filter(job => {
                const jobType = job.type.includes('Remote') ? 'Remote' :
                    job.type.includes('Hybrid') ? 'Hybrid' : 'On-site';

                const matchesWorkplace = this.filters.type.length === 0 || this.filters.type.includes(jobType);
                const matchesCity = this.filters.city.length === 0 || this.filters.city.some(city => job.location.includes(city));
                const matchesCategory = this.filters.category.length === 0 || this.filters.category.some(cat => job.title.includes(cat) || job.company.includes(cat));
                const matchesCompany = this.filters.company.length === 0 || this.filters.company.includes(job.company);

                return matchesWorkplace && matchesCity && matchesCategory && matchesCompany;
            });
        },
        totalPages() {
            return Math.max(1, Math.ceil(this.filteredJobs.length / this.pageSize));
        },
        paginatedJobs() {
            const start = (this.page - 1) * this.pageSize;
            return this.filteredJobs.slice(start, start + this.pageSize);
        }
    },

    async mounted() {
        try {
            // 1. Fetch Data
            this.allJobs = await JobModel.getAll();

            // 2. CAPTURE URL SEARCH PARAMETER
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('search');

            if (searchParam) {
                this.searchQuery = searchParam;
            }

        } catch (error) {
            console.error("Error loading jobs:", error);
        } finally {
            this.isLoading = false;
        }
    },

    watch: {
        'filters.salaryMin'(val) {
            // clamp and enforce relation
            if (val < 0) this.filters.salaryMin = 0;
            if (val > 100000) this.filters.salaryMin = 100000;
            if (this.filters.salaryMin > this.filters.salaryMax) {
                this.filters.salaryMax = this.filters.salaryMin;
            }
        },
        'filters.salaryMax'(val) {
            // clamp and enforce relation
            if (val < 0) this.filters.salaryMax = 0;
            if (val > 100000) this.filters.salaryMax = 100000;
            if (this.filters.salaryMax < this.filters.salaryMin) {
                this.filters.salaryMin = this.filters.salaryMax;
            }
        },
        filteredJobs() {
            // reset to first page when filters/search change result set
            this.page = 1;
        }
    },

    methods: {
        // Parse salary from various formats like "EGP 20,000 - 30,000", "15k", "20000"
        parseSalary(salaryText) {
            if (!salaryText) return null;
            try {
                let text = String(salaryText).toLowerCase();
                // Remove common tokens
                text = text.replace(/egp|\$|usd|eur|sar|aed|per\s*month|\/month|per\s*year|\/year|net|gross/g, '');
                // Remove commas and spaces to keep numbers intact
                text = text.replace(/[,\s]+/g, '');

                // Handle ranges like "20000-30000" or "15k-25k"
                const rangeMatch = text.match(/(\d+(?:\.\d+)?[km]?)-(\d+(?:\.\d+)?[km]?)/);
                if (rangeMatch) {
                    const a = this._toNumber(rangeMatch[1]);
                    const b = this._toNumber(rangeMatch[2]);
                    return Math.min(a, b);
                }
                // Single value like "35000" or "15k"
                const singleMatch = text.match(/(\d+(?:\.\d+)?[km]?)/);
                if (singleMatch) {
                    return this._toNumber(singleMatch[1]);
                }
                return null;
            } catch { return null; }
        },
        _toNumber(val) {
            if (typeof val !== 'string') val = String(val);
            const lower = val.toLowerCase();
            if (lower.endsWith('m')) { return parseFloat(lower.slice(0, -1)) * 1_000_000; }
            if (lower.endsWith('k')) { return parseFloat(lower.slice(0, -1)) * 1_000; }
            return parseFloat(lower);
        },
        formatCurrency(n) {
            const num = Number(n) || 0;
            return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(num);
        },

        goToDetails(jobId) {
            window.location.href = `job-details.html?id=${jobId}`;
        },

        // --- SHARED MODAL LOGIC ---
        openApplyModal(job) {
            const user = localStorage.getItem('user');

            if (!user) {
                this.showLoginNotification = true;
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                return;
            }

            this.selectedJobForApp = job || this.job;
            this.showApplyModal = true;
            this.newCvName = null;
        },

        closeModal() {
            this.showApplyModal = false;
            this.selectedJobForApp = null;
        },

        handleCvUpload(event) {
            const file = event.target.files[0];
            if (file) this.newCvName = file.name;
        },

        async applyWithExisting() {
            this.isApplying = true;
            try {
                const response = await ApplicationModel.submit(this.selectedJobForApp.id, 'existing');
                this.handleApplicationResult(response);
            } catch (error) {
                alert("An error occurred.");
            } finally {
                this.isApplying = false;
            }
        },

        async applyWithNew() {
            if (!this.newCvName) return;
            this.isApplying = true;
            try {
                const response = await ApplicationModel.submit(this.selectedJobForApp.id, 'new', this.newCvName);
                this.handleApplicationResult(response);
            } catch (error) {
                alert("An error occurred.");
            } finally {
                this.isApplying = false;
            }
        },

        handleApplicationResult(response) {
            if (response.success) {
                this.closeModal();
                this.successMessage = response.message;
                this.showSuccessNotification = true;
                setTimeout(() => { this.showSuccessNotification = false; }, 3000);
            } else {
                alert(response.message);
            }
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        setPage(p) {
            const target = Math.min(Math.max(1, p), this.totalPages);
            if (target === this.page) return;
            this.page = target;
            this.scrollToTop();
        },
        nextPage() { this.setPage(this.page + 1); },
        prevPage() { this.setPage(this.page - 1); },
    },

    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');