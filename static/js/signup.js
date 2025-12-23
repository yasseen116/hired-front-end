const { createApp } = Vue;

createApp({
    data() {
        return {
            fullname: '',
            jobTitle: '',
            skills: [{ id: Date.now(), value: '' }],
            cvFile: null,
            email: '',
            password: '',
            confirmPassword: '',
            isLoading: false,
            errorMessage: null,
            fileName: null,
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

        // --- NEW: API SIMULATION FOR FILE UPLOAD ---
        simulateFileUpload(file) {
            return new Promise((resolve, reject) => {
                console.log(`[API] Uploading file: ${file.name}...`);

                // 1. Create FileReader to convert file to Base64 string
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64String = e.target.result;

                    // Simulate network delay
                    setTimeout(() => {
                        // 2. Save the ACTUAL file data to LocalStorage (Simulation of S3/Database)
                        // WARNING: LocalStorage has a size limit (usually 5MB). Large PDFs might fail.
                        try {
                            localStorage.setItem('user_cv_file', base64String);

                            const fileData = {
                                fileName: file.name,
                                uploadDate: new Date().toLocaleDateString(),
                                status: 'uploaded'
                            };
                            console.log("[API] File uploaded successfully.");
                            resolve(fileData);
                        } catch (err) {
                            console.warn("File too large for LocalStorage simulation. Using mock.");
                            resolve({ fileName: file.name, status: 'error_too_large' });
                        }
                    }, 1500);
                };

                // Start reading the file
                reader.readAsDataURL(file);
            });
        },

        async handleSignup() {
            this.isLoading = true;
            this.errorMessage = null;

            // 1. Validation
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Passwords do not match!";
                this.isLoading = false;
                return;
            }

            const cleanSkills = this.skills
                .map(s => s.value)
                .filter(val => val.trim() !== "");

            try {
                // 2. SIMULATE CV UPLOAD (If a file was selected)
                let uploadedCvName = null;

                if (this.cvFile) {
                    // Wait for the "upload" to finish
                    const uploadResult = await this.simulateFileUpload(this.cvFile);
                    uploadedCvName = uploadResult.fileName;
                }

                // 3. SIMULATE ACCOUNT CREATION API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 4. CREATE USER OBJECT (Database Row Simulation)
                const user = {
                    name: this.fullname,
                    email: this.email,
                    jobTitle: this.jobTitle,
                    skills: cleanSkills,
                    // Save the CV Name we got from the "Upload API"
                    cvName: uploadedCvName,
                    token: "new-user-token-123"
                };

                // 5. SAVE TO LOCAL STORAGE (Simulates DB persistence)
                localStorage.setItem('user', JSON.stringify(user));

                // 6. REDIRECT TO HOME PAGE
                window.location.href = 'index.html';

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