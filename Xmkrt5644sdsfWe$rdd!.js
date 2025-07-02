        const subscribePopup = document.getElementById('subscribePopup');
        const closePopupBtn = document.getElementById('closePopupBtn');
        const unlockBtn = document.getElementById('unlockBtn');
        const blockedContent = document.getElementById('blockedContent');
        const blurOverlay = document.getElementById('blurOverlay');
        const premiumContent = document.getElementById('premiumContent');
        const form = document.getElementById('subscriptionForm');
        const successAlert = document.getElementById('successAlert');
        const errorAlert = document.getElementById('errorAlert');
        const submitBtn = document.getElementById('submitBtn');
        const buttonText = document.getElementById('buttonText');
        const emailInput = document.getElementById('email');

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzHZ1laIhPJZya81_G1MGSAMNI-Mk22lsE2gPxGBlVvWqOniUETx6sFjPVIKuoI6r3m/exec';

        function isSubscribed() {
            return localStorage.getItem('subscribed') === 'true';
        }

        function isValidGmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            return re.test(String(email).toLowerCase());
        }

        function showLoading() {
            submitBtn.disabled = true;
            buttonText.innerHTML = '<span class="g4t-spinner"></span> Submitting...';
        }

        function resetButton() {
            submitBtn.disabled = false;
            buttonText.textContent = 'Subscribe Now';
        }

        function showSubscribePopup() {
            subscribePopup.style.display = 'flex';
        }

        function hideSubscribePopup() {
            subscribePopup.style.display = 'none';
        }

        function unlockContent() {
            blurOverlay.style.filter = 'none';
            blurOverlay.style.pointerEvents = 'auto';
            blurOverlay.style.userSelect = 'auto';
            document.querySelector('.g4t-unlock-btn-container').style.display = 'none';
            premiumContent.style.display = 'block';
        }

        function init() {
            if (isSubscribed()) {
                unlockContent();
            } else {
                setTimeout(showSubscribePopup, 3000);
            }
        }

        closePopupBtn.addEventListener('click', hideSubscribePopup);
        unlockBtn.addEventListener('click', showSubscribePopup);
        subscribePopup.addEventListener('click', function(e) {
            if (e.target === subscribePopup) hideSubscribePopup();
        });

        emailInput.addEventListener('input', function() {
            if (this.value && !isValidGmail(this.value)) {
                this.setCustomValidity("Please enter a valid Gmail address");
            } else {
                this.setCustomValidity("");
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successAlert.style.display = 'none';
            errorAlert.style.display = 'none';
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            if (!name || name.length < 2) {
                errorAlert.textContent = "Please enter your full name (at least 2 characters)";
                errorAlert.style.display = 'block';
                return;
            }
            if (!email || !isValidGmail(email)) {
                errorAlert.textContent = "Please enter a valid Gmail address (example@gmail.com)";
                errorAlert.style.display = 'block';
                return;
            }
            showLoading();
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                const response = await fetch(scriptURL, { method: 'POST', body: formData });
                const result = await response.text();
                if (result === "success") {
                    localStorage.setItem('subscribed', 'true');
                    successAlert.textContent = "Thank you for subscribing! You now have access to all content.";
                    successAlert.style.display = 'block';
                    form.reset();
                    setTimeout(() => {
                        hideSubscribePopup();
                        unlockContent();
                    }, 2000);
                } else if (result.includes("error: Only Gmail addresses are allowed")) {
                    errorAlert.textContent = "Only Gmail addresses are accepted for subscription";
                    errorAlert.style.display = 'block';
                } else if (result.includes("error: This Gmail is already subscribed")) {
                    localStorage.setItem('subscribed', 'true');
                    successAlert.textContent = "Welcome back! You already have access to all content.";
                    successAlert.style.display = 'block';
                    setTimeout(() => {
                        hideSubscribePopup();
                        unlockContent();
                    }, 2000);
                } else if (result.includes("error: ")) {
                    errorAlert.textContent = result.replace("error: ", "");
                    errorAlert.style.display = 'block';
                } else {
                    errorAlert.textContent = "Subscription failed. Please try again.";
                    errorAlert.style.display = 'block';
                }
            } catch (error) {
                console.error('Error:', error);
                errorAlert.textContent = "Network error. Please check your connection and try again.";
                errorAlert.style.display = 'block';
            } finally {
                resetButton();
            }
        });

        init();
