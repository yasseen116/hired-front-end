const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            jobs: [],         
            searchTerm: '',   
            isLoading: true,  
            error: null,
            
            companies: [] 
        };
    },
    
    async mounted() {
        await this.loadJobs();
        
        this.companies = CompanyModel.getTopCompanies();
    },

    computed: {
        filteredJobs() {
            if (!this.searchTerm) return this.jobs;
            const term = this.searchTerm.toLowerCase();
            return this.jobs.filter(job => 
                job.title.toLowerCase().includes(term) ||
                job.company.toLowerCase().includes(term) ||
                job.location.toLowerCase().includes(term)
            );
        }
    },

    methods: {
        async loadJobs() {
            try {
                this.isLoading = true;
                this.jobs = await JobModel.fetchAll();
            } catch (err) {
                console.error("Failed to load jobs:", err);
                this.error = "Could not load jobs.";
            } finally {
                this.isLoading = false;
            }
        },

        scrollCompanies(direction) {
            const container = document.querySelector('.companies-grid');
            if (!container) return;

            const scrollAmount = 300;
            
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (direction === 'left') {
                if (container.scrollLeft <= 5) {
                    container.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            } else {
                if (container.scrollLeft >= maxScroll - 5) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        },

        applyForJob(job) {
            alert(`Application started for ${job.title}`);
        }
    },

    compilerOptions: {
        delimiters: ['[[', ']]'] 
    }
});

app.mount('#app');