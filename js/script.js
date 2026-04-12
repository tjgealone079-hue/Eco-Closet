    let isLoggedIn = false;

    let cart = [];
    let total = 0;
    let customerName = "";

    let totalWater = 0;
    let totalCarbon = 0;
    let totalWaste = 0;

    // Nav button variables
    const brandBtn = document.querySelector(".brand");
    const homeBtn = document.querySelector(".home");
    const loginBtn = document.querySelector(".login");
    const itemsBtn = document.querySelector(".items");
    const cartBtn = document.querySelector(".cart");
    const paymentBtn = document.querySelector(".payment");
    const checkOutBtn = document.querySelector(".checkOut");

    // Section variables
    const landingPage = document.getElementById("landingPage");
    const loginPage = document.getElementById("loginPage");
    const signupPage = document.getElementById("signupPage");
    const itemsPage = document.getElementById("itemsPage");
    const cartPage = document.getElementById("cartPage");
    const paymentPage = document.getElementById("paymentPage");
    const checkoutPage = document.getElementById("checkoutPage");

    const pageClassMap = {
      landingPage: "lanpage",
      loginPage: "logpage",
      signupPage: "logpage",
      itemsPage: "itemspage",
      cartPage: "cartpage",
      paymentPage: "paymentpage",
      checkoutPage: "checkoutpage"
    };

    const pageDisplayMap = { landingPage: "flex" };

    function showPage(id) {
      Object.keys(pageClassMap).forEach(pageId => {
        const el = document.getElementById(pageId);
        el.style.display = pageId === id ? (pageDisplayMap[pageId] || "flex") : "none";
      });
      const burgerWrap = document.getElementById("burgerWrap");
      burgerWrap.style.display = id === "landingPage" ? "none" : "flex";
      document.getElementById("burgerDropdown").style.display = "none";

      const authPages = ["landingPage", "loginPage", "signupPage"];
      homeBtn.style.display = authPages.includes(id) ? "" : "none";
      loginBtn.style.display = authPages.includes(id) ? "" : "none";
    }

    brandBtn.addEventListener("click", () => showPage("landingPage"));
    homeBtn.addEventListener("click", () => showPage("landingPage"));
    loginBtn.addEventListener("click", () => showPage("loginPage"));
    function requireLogin(action) {
      if (!isLoggedIn) {
        showPage("loginPage");
        document.getElementById("loginMsg").textContent = "Please log in or create an account first.";
        return false;
      }
      action();
      return true;
    }

    itemsBtn.addEventListener("click", () => requireLogin(() => showPage("itemsPage")));
    cartBtn.addEventListener("click", () => requireLogin(() => { updateCart(); showPage("cartPage"); }));
    paymentBtn.addEventListener("click", () => requireLogin(() => showPage("paymentPage")));
    checkOutBtn.addEventListener("click", () => requireLogin(() => showPage("checkoutPage")));

    document.getElementById("burgerBtn").addEventListener("click", () => {
      const dd = document.getElementById("burgerDropdown");
      dd.style.display = dd.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
      if (!document.getElementById("burgerWrap").contains(e.target)) {
        document.getElementById("burgerDropdown").style.display = "none";
      }
    });

    // Show landing page on load
    showPage("landingPage");


    function showSignup() { showPage("signupPage"); return false; }
    function showLogin() { showPage("loginPage"); return false; }

    function doLogin() {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const msg = document.getElementById("loginMsg");

      if (email === "" || password === "") {
        msg.textContent = "Please enter your email and password.";
        return;
      }

      customerName = email.split("@")[0];
      isLoggedIn = true;
      msg.textContent = `Welcome back, ${customerName}!`;
      setTimeout(() => showPage("itemsPage"), 500);
    }

    function doSignup() {
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const msg = document.getElementById("signupMsg");

      if (name === "" || email === "" || password === "") {
        msg.textContent = "Please fill in all fields.";
        return;
      }

      customerName = name;
      isLoggedIn = true;
      msg.textContent = `Account created! Welcome, ${name}!`;
      setTimeout(() => showPage("itemsPage"), 500);
    }

    function showToast(msg) {
      const toast = document.getElementById("toastMsg");
      toast.textContent = msg;
      toast.style.display = "block";
      setTimeout(() => toast.style.display = "none", 2500);
    }

    // Adds a product to the cart, updates eco-impact totals, and refreshes the cart display
    function addToCart(item, price, water, carbon, waste) {
      cart.push({ item, price, water, carbon, waste });
      total += price;
      totalWater += water;
      totalCarbon += carbon;
      totalWaste += waste;
      updateCart();
      showToast(item + " added to cart!");
    }

    // Removes a product from the cart by index and updates all totals
    function removeItem(index) {
      total -= cart[index].price;
      totalWater -= cart[index].water;
      totalCarbon -= cart[index].carbon;
      totalWaste -= cart[index].waste;
      cart.splice(index, 1);
      updateCart();
    }

    // Re-renders the cart table, totals, eco-impact stats, badge, reward, and progress bar
    function updateCart() {
      const cartItems = document.getElementById("cartItems");
      const cartTotal = document.getElementById("cartTotal");
      const waterSaved = document.getElementById("waterSaved");
      const carbonSaved = document.getElementById("carbonSaved");
      const wasteSaved = document.getElementById("wasteSaved");

      const dashItems = document.getElementById("dashItems");
      const dashWater = document.getElementById("dashWater");
      const dashCarbon = document.getElementById("dashCarbon");
      const dashWaste = document.getElementById("dashWaste");
      const currentBadge = document.getElementById("currentBadge");
      const currentReward = document.getElementById("currentReward");
      const progressFill = document.getElementById("progressFill");

      if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
      } else {
        cartItems.innerHTML = "";
        cart.forEach((product, index) => {
          cartItems.innerHTML += `
            <tr>
              <td>${product.item}</td>
              <td>₱${product.price}</td>
              <td>${product.water} L</td>
              <td>${product.carbon} kg</td>
              <td>${product.waste}</td>
              <td><button class="outline-btn" onclick="removeItem(${index})">Remove</button></td>
            </tr>
          `;
        });
      }

      cartTotal.textContent = total;
      waterSaved.textContent = totalWater.toLocaleString();
      carbonSaved.textContent = totalCarbon;
      wasteSaved.textContent = totalWaste;

      dashItems.textContent = cart.length;
      dashWater.textContent = totalWater.toLocaleString() + " L";
      dashCarbon.textContent = totalCarbon + " kg";
      dashWaste.textContent = totalWaste;

      let badge = "No badge yet";
      let reward = "Keep thrifting to unlock rewards";

      if (cart.length >= 50) {
        badge = "Eco Champion";
        reward = "Free shipping + exclusive discount";
      } else if (cart.length >= 30) {
        badge = "Planet Protector";
        reward = "15% discount reward";
      } else if (cart.length >= 15) {
        badge = "Sustainability Supporter";
        reward = "10% discount reward";
      } else if (cart.length >= 5) {
        badge = "Eco Beginner";
        reward = "Free shipping reward";
      }

      currentBadge.textContent = badge;
      currentReward.textContent = reward;

      let progress = Math.min((totalWater / 50000) * 100, 100);
      progressFill.style.width = progress + "%";
      progressFill.textContent = Math.floor(progress) + "%";
    }

    function logout() {
      isLoggedIn = false;
      cart = [];
      total = 0;
      customerName = "";
      totalWater = 0;
      totalCarbon = 0;
      totalWaste = 0;
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
      document.getElementById("loginMsg").textContent = "";
      document.getElementById("checkoutTitle").style.display = "none";
      document.getElementById("checkoutMessage").style.display = "none";
      document.getElementById("emptyCheckoutMessage").style.display = "block";
      updateCart();
      showPage("loginPage");
    }

    // Refreshes the cart and navigates to the cart page
    function goToCart() {
      updateCart();
      showPage("cartPage");
    }

    // Navigates to the payment page, blocking if the cart is empty
    function goToPayment() {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      showPage("paymentPage");
    }

    // Validates payment details, populates the checkout summary, and navigates to the checkout page
    function goToCheckout() {
      const paymentMethod = document.getElementById("paymentMethod").value;
      const accountName = document.getElementById("accountName").value.trim();
      const accountNumber = document.getElementById("accountNumber").value.trim();
      const address = document.getElementById("address").value.trim();

      if (accountName === "" || accountNumber === "" || address === "") {
        alert("Please complete your payment details.");
        return;
      }

      document.getElementById("finalMessage").textContent =
        `Thank you, ${customerName || "shopper"}! Your EcoCloset order has been placed successfully.`;

      document.getElementById("finalTotal").textContent =
        `Total Paid: ₱${total}`;

      document.getElementById("finalPayment").textContent =
        `Payment Method: ${paymentMethod}`;

      document.getElementById("finalImpact").textContent =
        `Your Impact: ${totalWater.toLocaleString()} L water saved | ${totalCarbon} kg CO2 reduced | ${totalWaste} clothing item(s) rescued`;

      document.getElementById("finalBadge").textContent =
        `Badge Earned: ${document.getElementById("currentBadge").textContent}`;

      document.getElementById("checkoutTitle").style.display = "block";
      document.getElementById("checkoutMessage").style.display = "block";
      document.getElementById("emptyCheckoutMessage").style.display = "none";
      showPage("checkoutPage");
    }

    // Resets all cart data, clears all form fields, and returns to the login page
    function resetShop() {
      isLoggedIn = false;
      cart = [];
      total = 0;
      customerName = "";
      totalWater = 0;
      totalCarbon = 0;
      totalWaste = 0;

      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
      document.getElementById("signupName").value = "";
      document.getElementById("signupEmail").value = "";
      document.getElementById("signupPassword").value = "";
      document.getElementById("loginMsg").textContent = "";
      document.getElementById("signupMsg").textContent = "";
      document.getElementById("accountName").value = "";
      document.getElementById("accountNumber").value = "";
      document.getElementById("address").value = "";
      document.getElementById("paymentMethod").value = "Cash on Delivery";

      updateCart();
      showPage("loginPage");
    }