const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: true,
            job: {
                // Initial empty state matching your Schema structure
                description: [],
                responsibilities: [],
                softSkills: [], // Note: API likely sends 'softSkills' (camelCase)
                qualifications: [],
                company: '',
                title: ''
            },
            similarJobs: [],
            error: null,

            // UI States
            isCopied: false,
            isInWishlist: false,
            loginMessage: false,

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
    async mounted() {
        // 1. Get Job ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('id');

        if (!jobId) {
            this.error = "No Job ID specified.";
            this.loading = false;
            return;
        }

        try {
            // 2. Fetch the Specific Job
            // Note: Using '/jobs/' based on your successful browse-jobs connection
            const response = await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}`);

            if (!response.ok) throw new Error("Job not found");

            this.job = await response.json();

            // 3. Fetch Similar Jobs (Client-side simulation)
            // We fetch all jobs and filter for the same category
            this.fetchSimilarJobs(jobId, this.job.category);

            // 4. Check Wishlist (Local Storage)
            this.checkWishlistStatus(jobId);

        } catch (error) {
            console.error("Error loading job:", error);
            this.error = "Job not found or API is down.";
        } finally {
            this.loading = false;
        }
    },

    methods: {
        async fetchSimilarJobs(currentId, category) {
            try {
                // Fetch all jobs to find matches
                // (In a real large app, you would have a backend endpoint for this)
                const res = await fetch('http://127.0.0.1:8000/jobs');
                if (res.ok) {
                    const allJobs = await res.json();

                    // Filter: Same category, not the current job, limit to 3
                    this.similarJobs = allJobs
                        .filter(j => j.category === category && j.id != currentId)
                        .slice(0, 3);
                }
            } catch (err) {
                console.warn("Could not load similar jobs", err);
            }
        },

        async copyLink() {
            try {
                const link = window.location.href;
                await navigator.clipboard.writeText(link);
                this.isCopied = true;
                setTimeout(() => { this.isCopied = false; }, 1250);
            } catch (err) {
                console.error('Failed to copy: ', err);
                alert("Could not copy link automatically.");
            }
        },

        // --- WISHLIST LOGIC (Kept on LocalStorage for now) ---
        checkWishlistStatus(id) {
            if (!localStorage.getItem('user')) return;
            const wishlist = JSON.parse(localStorage.getItem('my_wishlist') || '[]');
            // Ensure we compare strings to strings
            this.isInWishlist = wishlist.includes(String(id));
        },

        toggleWishlist() {
            const user = localStorage.getItem('user');
            if (!user) {
                this.loginMessage = true;
                setTimeout(() => { this.loginMessage = false; }, 2000);
                return;
            }

            const jobId = String(this.job.id);
            let wishlist = JSON.parse(localStorage.getItem('my_wishlist') || '[]');

            if (this.isInWishlist) {
                wishlist = wishlist.filter(id => id !== jobId);
                this.isInWishlist = false;
            } else {
                wishlist.push(jobId);
                this.isInWishlist = true;
            }
            localStorage.setItem('my_wishlist', JSON.stringify(wishlist));
        },

        // --- APPLY MODAL LOGIC ---
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
            // TODO: Connect to Backend API
            setTimeout(() => {
                this.isApplying = false;
                this.successMessage = `Application sent to ${this.selectedJobForApp.company}!`;
                this.showSuccessNotification = true;
                this.closeModal();
                setTimeout(() => this.showSuccessNotification = false, 3000);
            }, 1000);
        },

        async applyWithNew() {
            if (!this.newCvName) return;
            this.isApplying = true;
            // TODO: Connect to Backend API
            setTimeout(() => {
                this.isApplying = false;
                this.successMessage = `Application sent to ${this.selectedJobForApp.company}!`;
                this.showSuccessNotification = true;
                this.closeModal();
                setTimeout(() => this.showSuccessNotification = false, 3000);
            }, 1000);
        }
    },

    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');