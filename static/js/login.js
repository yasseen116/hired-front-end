const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            isLoading: false,
            errorMessage: null
        }
    },
    
    methods: {
        async handleLogin() {
            this.isLoading = true;
            this.errorMessage = null;

            if (!this.email || !this.password) {
                this.errorMessage = "Please fill in all fields.";
                this.isLoading = false;
                return;
            }

            try {
                console.log("Attempting login for:", this.email);
                
                await new Promise(resolve => setTimeout(resolve, 2000));

                alert(`Login Successful! Welcome back, ${this.email}`);

            } catch (error) {
                this.errorMessage = "Invalid email or password.";
            } finally {
                this.isLoading = false;
            }
        }
    },
    
    compilerOptions: {
        delimiters: ['[[', ']]'] 
    }
}).mount('#app');