const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: true,
            isSaving: false,

            // User Data
            user: {
                name: '',
                jobTitle: '',
                email: '',
                phone: '',
                location: '',
                about: '',
                photo: null,
                skills: [],
                experience: [],
                education: [],
                cvName: null
            },
            applications: [],

            // Notification States
            showSuccessNotification: false,
            successMessage: '',

            // NEW: Delete Modal State
            showDeleteModal: false
        }
    },
    async mounted() {
        await this.loadProfile();
    },
    methods: {
        async loadProfile() {
            try {
                // 1. Get User Data
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (!storedUser) {
                    window.location.href = 'login.html';
                    return;
                }

                // 2. Hydrate Skills
                let formattedSkills = [];
                if (storedUser.skills && storedUser.skills.length > 0) {
                    formattedSkills = storedUser.skills.map((s, i) => ({ id: Date.now() + i, value: s }));
                } else {
                    formattedSkills = [{ id: Date.now(), value: '' }];
                }

                // 3. Hydrate Experience & Education
                let formattedExp = storedUser.experience || [{ id: Date.now(), role: '', company: '', years: '' }];
                let formattedEdu = storedUser.education || [{ id: Date.now(), degree: '', university: '', year: '' }];

                // 4. Merge Data
                this.user = {
                    ...this.user,
                    ...storedUser,
                    skills: formattedSkills,
                    experience: formattedExp,
                    education: formattedEdu
                };

                // 5. Get Applications
                const rawApps = JSON.parse(localStorage.getItem('my_applications') || '[]');

                const enrichedApps = await Promise.all(rawApps.map(async (app) => {
                    try {
                        const job = await JobModel.getById(app.jobId);
                        return { ...app, jobTitle: job.title };
                    } catch (e) {
                        return { ...app, jobTitle: 'Job ID #' + app.jobId };
                    }
                }));

                this.applications = enrichedApps.reverse();

            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        // --- SKILLS ---
        addSkill() { this.user.skills.push({ id: Date.now(), value: '' }); },
        removeSkill(index) { this.user.skills.splice(index, 1); },

        // --- EXPERIENCE ---
        addExperience() { this.user.experience.push({ id: Date.now(), role: '', company: '', years: '' }); },
        removeExperience(index) { this.user.experience.splice(index, 1); },

        // --- EDUCATION ---
        addEducation() { this.user.education.push({ id: Date.now(), degree: '', university: '', year: '' }); },
        removeEducation(index) { this.user.education.splice(index, 1); },

        // --- CV ---
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.user.cvName = file.name;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        localStorage.setItem('user_cv_file', e.target.result);
                    } catch (err) {
                        console.warn("File too large for LocalStorage preview.");
                    }
                };
                reader.readAsDataURL(file);
            }
        },

        previewCv() {
            if (!this.user.cvName) return;
            const base64File = localStorage.getItem('user_cv_file');

            if (base64File) {
                const win = window.open();
                win.document.write(
                    `<iframe src="${base64File}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                );
            } else {
                alert(`Simulating preview for: ${this.user.cvName}`);
                window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
            }
        },

        // --- UPDATED: Delete Logic ---
        // 1. Trigger the Modal
        removeCv() {
            this.showDeleteModal = true;
        },

        // 2. Actually Delete (Called from Modal)
        confirmDeleteCv() {
            this.user.cvName = null;
            this.showDeleteModal = false;

            // Show Green Toast
            this.successMessage = "Resume removed successfully.";
            this.showSuccessNotification = true;
            setTimeout(() => { this.showSuccessNotification = false; }, 3000);
        },

        // 3. Cancel Delete
        closeDeleteModal() {
            this.showDeleteModal = false;
        },

        // --- SAVE ---
        saveProfile() {
            this.isSaving = true;

            const cleanSkills = this.user.skills.map(s => s.value).filter(v => v.trim() !== "");
            const cleanExp = this.user.experience.filter(e => e.role.trim() !== "");
            const cleanEdu = this.user.education.filter(e => e.degree.trim() !== "");

            const userToSave = {
                ...this.user,
                skills: cleanSkills,
                experience: cleanExp,
                education: cleanEdu
            };

            setTimeout(() => {
                localStorage.setItem('user', JSON.stringify(userToSave));
                this.isSaving = false;

                this.successMessage = "Profile saved successfully!";
                this.showSuccessNotification = true;

                setTimeout(() => {
                    this.showSuccessNotification = false;
                }, 3000);
            }, 800);
        },

        getStatusClass(status) {
            if (status === 'Accepted') return 'badge-accepted';
            if (status === 'Rejected') return 'badge-rejected';
            return 'badge-pending';
        }
    },
    compilerOptions: { delimiters: ['[[', ']]'] }
}).mount('#app');