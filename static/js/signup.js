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
        handleFileUpload(event) {
            this.cvFile = event.target.files[0];
        },

        addSkill() {
            this.skills.push({ id: Date.now(), value: '' });
        },

        removeSkill(index) {
            if (this.skills.length > 1) {
                this.skills.splice(index, 1);
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
                console.log("Signup Data:", {
                    name: this.fullname,
                    skills: cleanSkills,
                    file: this.cvFile ? this.cvFile.name : "None"
                });
                
                await new Promise(resolve => setTimeout(resolve, 2000));

                alert(`Account created! Skills: ${cleanSkills.join(", ")}`);
                
            } catch (error) {
                this.errorMessage = "Something went wrong.";
            } finally {
                this.isLoading = false;
            }
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.cvFile = file;
                this.fileName = file.name;
            }
        }
    },
    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');