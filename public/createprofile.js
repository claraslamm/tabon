document.addEventListener('DOMContentLoaded', () => {

    const user = document.querySelector('#typeUser');
    const company = document.querySelector('#typeCompany');
    const userForm = document.querySelector('#userForm');
    const companyForm = document.querySelector('#companyForm');

    user.addEventListener('change', () => {
        userForm.style = "display:block";
        companyForm.style = "display:none";
    })

    company.addEventListener('change', () => {
        userForm.style = "display:none";
        companyForm.style = "display:block";
    })









})