document.addEventListener('DOMContentLoaded', () => {
    const adminLoginLink = document.getElementById('adminLoginLink');

    document.addEventListener('dblclick', (event) => {
        const clickX = event.clientX;
        const clickY = event.clientY;

        const secretZoneSize = 100;
        const isWithinSecretZone = clickX > (window.innerWidth - secretZoneSize) && clickY < secretZoneSize;

        if (isWithinSecretZone) {
            adminLoginLink.classList.add('visible');

            setTimeout(() => {
                adminLoginLink.classList.remove('visible');
            }, 5000); 
            //hola
        }
    });
});