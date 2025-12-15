const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: true,
            job: {}, // Starts empty, will be filled by the Model
            similarJobs: [],
            error: null
        }
    },
    
    async mounted() {
        // 1. Get the Job ID from the URL (e.g., job-details.html?id=1)
        const urlParams = new URLSearchParams(window.location.search);
        // Default to ID 1 (Fawry) if no ID is provided, just so the page isn't broken during testing
        const jobId = urlParams.get('id') || 1; 

        console.log("Attempting to load Job ID:", jobId);

        try {
            this.loading = true;
            
            // 2. Ask the Model for the specific Job Data
            this.job = await JobModel.getById(jobId);
            
            // 3. Ask Model for similar jobs based on the title
            if (this.job && this.job.title) {
                // Example: Take the first word (e.g., "Software" from "Software Engineer")
                const keyword = this.job.title.split(' ')[0];
                this.similarJobs = JobModel.getSimilar(jobId, keyword);
            }

        } catch (err) {
            console.error("Error loading job details:", err);
            this.error = "Job not found!";
        } finally {
            this.loading = false;
        }
    },
    
    compilerOptions: {
        delimiters: ['[[', ']]']
    }
}).mount('#app');