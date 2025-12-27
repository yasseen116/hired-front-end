const { createApp } = Vue;

createApp({
    data() {
        return {
            role: 'seeker', // Default role

            fullname: '',
            jobTitle: '',
            companyName: '', // For Providers

            skills: [{ id: Date.now(), value: '' }],
            cvFile: null,
            fileName: null,

            email: '',
            password: '',
            confirmPassword: '',

            isLoading: false,
            errorMessage: null,
        }
    },

    methods: {
        addSkill() {
            this.skills.push({ id: Date.now(), value: '' });
        },

        removeSkill(index) {
            if (this.skills.length > 1) {
                this.skills.splice(index, 1);
            }
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.cvFile = file;
                this.fileName = file.name;
            }
        },

        simulateFileUpload(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result;
                    setTimeout(() => {
                        try {
                            localStorage.setItem('user_cv_file', base64String);
                            resolve({ fileName: file.name });
                        } catch (err) {
                            console.warn("File too large for storage.");
                            resolve({ fileName: file.name });
                        }
                    }, 1500);
                };
                reader.readAsDataURL(file);
            });
        },

        async handleSignup() {
            this.isLoading = true;
            this.errorMessage = null;

            // 1. Common Validation
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Passwords do not match!";
                this.isLoading = false;
                return;
            }

            try {
                let uploadedCvName = null;
                let cleanSkills = [];

                // 2. Seeker Specific Logic
                if (this.role === 'seeker') {
                    cleanSkills = this.skills.map(s => s.value).filter(val => val.trim() !== "");

                    if (this.cvFile) {
                        const uploadResult = await this.simulateFileUpload(this.cvFile);
                        uploadedCvName = uploadResult.fileName;
                    }
                }

                // 3. API Delay Simulation
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 4. Construct User Object
                const user = {
                    name: this.fullname,
                    email: this.email,
                    jobTitle: this.jobTitle,
                    role: this.role, // SAVE THE ROLE!
                    token: "new-user-token-123"
                };

                // Add specific fields based on role
                if (this.role === 'seeker') {
                    user.skills = cleanSkills;
                    user.cvName = uploadedCvName;
                    user.experience = [];
                    user.education = [];
                } else {
                    user.company = this.companyName;
                }

                // 5. Save & Redirect
                localStorage.setItem('user', JSON.stringify(user));

                if (this.role === 'provider') {
                    window.location.href = 'dashboard.html'; // Provider -> Dashboard
                } else {
                    window.location.href = 'index.html'; // Seeker -> Home
                }

            } catch (error) {
                console.error(error);
                this.errorMessage = "Something went wrong during signup.";
                this.isLoading = false;
            }
        }
    },
    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');