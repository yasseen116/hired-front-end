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

        async handleSignup() {
            this.isLoading = true;
            this.errorMessage = null;

            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Passwords do not match!";
                this.isLoading = false;
                return;
            }

            const cleanSkills = this.skills
                .map(s => s.value)
                .filter(val => val.trim() !== "");

            try {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 1. CREATE USER OBJECT
                // Use the real name they typed in the form
                const user = {
                    name: this.fullname, 
                    email: this.email,
                    jobTitle: this.jobTitle,
                    skills: cleanSkills,
                    token: "new-user-token-123"
                };

                // 2. SAVE TO LOCAL STORAGE (Logs them in)
                localStorage.setItem('user', JSON.stringify(user));

                // 3. REDIRECT TO HOME PAGE
                window.location.href = '/preview/index.html';
                
            } catch (error) {
                console.error(error);
                this.errorMessage = "Something went wrong.";
                this.isLoading = false;
            }
        }
    },
    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');