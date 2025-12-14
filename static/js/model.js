class JobModel {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.company = data.company;
        this.location = data.location;
        this.experience = data.experience;
        this.salary = data.salary;
    }

    /**
     * SIMULATING AN API CALL
     * currently: Returns "fake" data immediately.
     * Future: You will replace the body of this function with 'return fetch("/api/jobs");'
     */
    static async fetchAll() {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockData = [
            {
                id: 1,
                title: "Software Engineer (Testing)",
                company: "Fawry",
                location: "Smart Village",
                experience: "0-5 Years",
                salary: "Negotiable"
            },
            {
                id: 2,
                title: "Architectural engineer",
                company: "Elsoadaa",
                location: "Giza",
                experience: "0-5 Years",
                salary: "Negotiable"
            },
            {
                id: 3,
                title: "Pharmacist",
                company: "Elezaby",
                location: "Alexandria",
                experience: "1-3 Years",
                salary: "Negotiable"
            },
            {
                id: 4,
                title: "Cashier",
                company: "Monginis",
                location: "Zagazig",
                experience: "Not Required",
                salary: "3 K – 5 K / month"
            },
            {
                id: 5,
                title: "Sales Associate",
                company: "Town Team",
                location: "Banha",
                experience: "Not Required",
                salary: "5 K – 8 K / month"
            },
            {
                id: 6,
                title: "Quality Control Assistant",
                company: "Eva Pharma",
                location: "Cairo",
                experience: "2-4 Years",
                salary: "Negotiable"
            },
            {
                id: 7,
                title: "Customer Service Agent",
                company: "Bank Misr",
                location: "Maadi Branch 1",
                experience: "2-5 Years",
                salary: "Negotiable"
            },
            {
                id: 8,
                title: "UI/UX Designer",
                company: "LC Waikiki",
                location: "Remote",
                experience: "Not Required",
                salary: "Negotiable"
            }
        ];

        return mockData.map(job => new JobModel(job));
    }
}

class CompanyModel {
    static getTopCompanies() {
        return [
            { name: "LC Waikiki", logo: "../static/images/companies/lcwaikiki.png" },
            { name: "Elsewedy Electric", logo: "../static/images/companies/elsewedy.png" },
            { name: "Breadfast", logo: "../static/images/companies/breadfast.png" },
            { name: "IBM", logo: "../static/images/companies/ibm.png" },
            { name: "Microsoft", logo: "../static/images/companies/microsoft.png" },
            { name: "Etoile", logo: "../static/images/companies/etoile.webp" },
            { name: "Google", logo: "../static/images/companies/google.png" },
            { name: "ValU", logo: "../static/images/companies/valu.webp" },
            { name: "Juhayna", logo: "../static/images/companies/juhayna.png" },
            { name: "CIB", logo: "../static/images/companies/cib.png" },
            { name: "Orascom", logo: "../static/images/companies/orascom.png" },
            { name: "Fawry", logo: "../static/images/companies/fawry.png" },
            { name: "Palm Hills", logo: "../static/images/companies/palm.png" },
            { name: "Vodafone", logo: "../static/images/companies/vodafone.png" },
            { name: "NBE", logo: "../static/images/companies/nbe.png" },
            { name: "Edita", logo: "../static/images/companies/edita.png" }
        ];
    }
}