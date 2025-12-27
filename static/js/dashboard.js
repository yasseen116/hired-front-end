const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: true,
            activeTab: 'post',
            user: {},

            // --- EDIT MODE STATE (New) ---
            isEditing: false,
            editingId: null,

            // --- DROPDOWN STATE ---
            categoryOpen: false,
            typeOpen: false,
            categories: [
                'Development', 'Design', 'Marketing', 'Finance',
                'Engineering', 'Sales', 'Healthcare'
            ],
            jobTypes: ['On-site', 'Remote', 'Hybrid'],

            // Post/Edit Job Form Data
            uploadMode: 'url',
            isSubmitting: false,
            logoFile: null,
            raw: { description: '', responsibilities: '', qualifications: '', soft_skills: '' },
            form: { title: '', company: '', location: '', experience: '', salary: '', type: 'On-site', category: '', logo_url: '' },

            // Manage Jobs State
            myJobs: [],
            showDeleteModal: false,
            jobToDelete: null,

            // Real Applications State
            applications: [],

            // Toasts
            showSuccess: false,
            successMessage: ''
        }
    },

    computed: {
        pendingAppsCount() {
            return this.applications.filter(a => a.status === 'Pending').length;
        }
    },

    async mounted() {
        // 1. Load User
        const userJson = localStorage.getItem('user');
        if(userJson) {
            this.user = JSON.parse(userJson);
            this.form.company = this.user.company;

            // Hydrate photo if exists
            const storedPhoto = localStorage.getItem('user_photo');
            if (storedPhoto) this.user.photo = storedPhoto;
        }

        // 2. Load Data
        await this.loadMyJobs();
        this.loadRealApplications();

        // 3. Add Event Listener for closing dropdowns
        document.addEventListener('click', this.closeDropdowns);

        this.loading = false;
    },

    unmounted() {
        document.removeEventListener('click', this.closeDropdowns);
    },

    methods: {
        // --- DROPDOWN LOGIC ---
        toggleCategory() {
            this.categoryOpen = !this.categoryOpen;
            this.typeOpen = false;
        },
        selectCategory(option) {
            this.form.category = option;
            this.categoryOpen = false;
        },
        toggleType() {
            this.typeOpen = !this.typeOpen;
            this.categoryOpen = false;
        },
        selectType(option) {
            this.form.type = option;
            this.typeOpen = false;
        },
        closeDropdowns(e) {
            if (!e.target.closest('.custom-select-wrapper')) {
                this.categoryOpen = false;
                this.typeOpen = false;
            }
        },

        // --- MANAGE JOBS LOGIC ---
        async loadMyJobs() {
            try {
                const allJobs = await JobModel.getAll();
                if (this.user.company) {
                    const myCompany = this.user.company.toLowerCase().trim();
                    this.myJobs = allJobs.filter(j => j.company.toLowerCase().includes(myCompany));
                } else {
                    this.myJobs = [];
                }
            } catch (err) {
                console.error("Failed to load jobs", err);
            }
        },

        // --- EDIT JOB LOGIC (New) ---
        arrayToText(arr) {
            if (!arr || !Array.isArray(arr)) return '';
            return arr.join('\n');
        },

        editJob(job) {
            this.isEditing = true;
            this.editingId = job.id;

            // 1. Populate Basic Fields
            this.form = {
                title: job.title,
                company: job.company,
                location: job.location,
                experience: job.experience,
                salary: job.salary,
                type: job.type || 'On-site',
                category: job.category || '',
                logo_url: job.logoUrl || ''
            };

            // 2. Populate Text Areas (Convert Arrays -> String)
            this.raw.description = this.arrayToText(job.description);
            this.raw.responsibilities = this.arrayToText(job.responsibilities);
            this.raw.qualifications = this.arrayToText(job.qualifications);
            // Handle snake_case vs camelCase mismatch if present
            this.raw.soft_skills = this.arrayToText(job.softSkills || job.soft_skills);

            // 3. Determine Logo Mode
            if (job.logoUrl && !job.logoUrl.startsWith('blob:') && !job.logoUrl.startsWith('data:')) {
                this.uploadMode = 'url';
            }

            // 4. Switch Tab & Scroll
            this.activeTab = 'post';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        cancelEdit() {
            this.resetForm();
        },

        // --- POST / PUT JOB LOGIC ---
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) this.logoFile = file;
        },
        textToArray(text) {
            if (!text) return [];
            return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        },

        async submitJob() {
            this.isSubmitting = true;
            try {
                // 1. Prepare Arrays
                const descriptionArr = this.textToArray(this.raw.description);
                const responsibilitiesArr = this.textToArray(this.raw.responsibilities);
                const qualificationsArr = this.textToArray(this.raw.qualifications);
                const softSkillsArr = this.textToArray(this.raw.soft_skills);

                let response;

                // 2. Determine Endpoint & Method (POST vs PUT)
                // If editing, use ID. If creating, use root endpoint.
                const baseUrl = 'http://127.0.0.1:8000/api/jobs';
                const method = this.isEditing ? 'PUT' : 'POST';

                // --- SCENARIO A: JSON (URL Mode or Editing without new file) ---
                if (this.uploadMode === 'url') {
                    const url = this.isEditing ? `${baseUrl}/${this.editingId}` : `${baseUrl}/`;

                    const payload = {
                        ...this.form,
                        description: descriptionArr,
                        responsibilities: responsibilitiesArr,
                        qualifications: qualificationsArr,
                        soft_skills: softSkillsArr
                    };

                    response = await fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                } else {
                    // --- SCENARIO B: MULTIPART (File Upload) ---
                    // Assuming backend supports PUT on /api/jobs/with-logo/{id}
                    const url = this.isEditing ? `${baseUrl}/with-logo/${this.editingId}` : `${baseUrl}/with-logo`;

                    const formData = new FormData();
                    formData.append('title', this.form.title);
                    formData.append('company', this.form.company);
                    formData.append('location', this.form.location);
                    formData.append('experience', this.form.experience);
                    formData.append('salary', this.form.salary);
                    formData.append('type', this.form.type);
                    formData.append('category', this.form.category);

                    descriptionArr.forEach(item => formData.append('description', item));
                    responsibilitiesArr.forEach(item => formData.append('responsibilities', item));
                    qualificationsArr.forEach(item => formData.append('qualifications', item));
                    softSkillsArr.forEach(item => formData.append('soft_skills', item));

                    if (this.logoFile) {
                        formData.append('logo', this.logoFile);
                    } else if (!this.isEditing) {
                        // If creating new job, file is mandatory in this mode
                        alert("Please select a logo file first.");
                        this.isSubmitting = false; return;
                    }

                    response = await fetch(url, {
                        method: method,
                        body: formData
                    });
                }

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.detail || 'Operation failed');
                }

                this.successMessage = this.isEditing ? "Job Updated Successfully!" : "Job Posted Successfully!";
                this.showSuccess = true;

                this.resetForm(); // Reset form and edit state
                await this.loadMyJobs(); // Refresh list

                // If we were editing, go back to manage list
                if (this.isEditing) {
                    this.activeTab = 'manage';
                    this.isEditing = false; // ensure state is clear
                }

                setTimeout(() => { this.showSuccess = false; }, 3000);

            } catch (error) {
                console.error(error);
                alert("Error: " + error.message);
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            // Reset Edit State
            this.isEditing = false;
            this.editingId = null;

            // Reset Fields
            const companyName = this.form.company;
            this.form = {
                title: '', company: companyName, location: '', experience: '',
                salary: '', type: 'On-site', category: '', logo_url: ''
            };
            this.raw = { description: '', responsibilities: '', qualifications: '', soft_skills: '' };
            this.logoFile = null;
        },

        // --- REAL APPLICATIONS LOGIC ---
        loadRealApplications() {
            const allApps = JSON.parse(localStorage.getItem('my_applications') || '[]');
            const myJobIds = this.myJobs.map(j => String(j.id));

            this.applications = allApps
                .filter(app => myJobIds.includes(String(app.jobId)))
                .map(app => {
                    const job = this.myJobs.find(j => String(j.id) === String(app.jobId));
                    return {
                        ...app,
                        jobTitle: job ? job.title : 'Unknown Job',
                        applicantName: app.userEmail
                    };
                }).reverse();
        },

        updateAppStatus(app, newStatus) {
            app.status = newStatus;
            const allApps = JSON.parse(localStorage.getItem('my_applications') || '[]');
            const index = allApps.findIndex(a => a.id === app.id);

            if (index !== -1) {
                allApps[index].status = newStatus;
                localStorage.setItem('my_applications', JSON.stringify(allApps));
            }
        },

        getStatusClass(status) {
            if (status === 'Accepted') return 'badge-accepted';
            if (status === 'Rejected') return 'badge-rejected';
            return 'badge-pending';
        },

        // --- MANAGE JOBS (Delete/View) ---
        viewJob(id) {
            window.location.href = `job-details.html?id=${id}`;
        },

        confirmDeleteJob(id) {
            this.jobToDelete = id;
            this.showDeleteModal = true;
        },

        async deleteJob() {
            if (!this.jobToDelete) return;
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/jobs/${this.jobToDelete}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.successMessage = "Job deleted successfully";
                    this.showSuccess = true;
                    this.myJobs = this.myJobs.filter(j => j.id !== this.jobToDelete);
                    this.loadRealApplications();
                } else {
                    alert("Failed to delete job.");
                }
            } catch (err) {
                console.error(err);
                alert("Error connecting to server.");
            } finally {
                this.showDeleteModal = false;
                this.jobToDelete = null;
                setTimeout(() => this.showSuccess = false, 3000);
            }
        }
    },
    compilerOptions: { delimiters: ['[[', ']]'] }
}).mount('#dashboard-app');