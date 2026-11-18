$(function () {
    const doughs = {
        classic: { label: "Classic Napoli base", price: 8.9, className: "dough-classic", phrase: "Classic Napoli! A dependable circle of happiness." },
        thin: { label: "Thin & crispy base", price: 9.4, className: "dough-thin", phrase: "Thin and crispy! This crust makes a sound before it makes a promise." },
        deep: { label: "Deep-pan cloud base", price: 10.4, className: "dough-deep", phrase: "Deep pan! Finally, a pizza with the confidence of a sofa." }
    };

    const ingredients = {
        cheese: { icon: "🧀", label: "Extra mozzarella", price: 1.2, pieces: 8, phrase: "Mamma mia! More mozzarella. The pizza now needs its own postcode." },
        pepperoni: { icon: "🍖", label: "Pepperoni", price: 1.6, pieces: 6, phrase: "Bellissimo! Pepperoni medals for your brave decisions." },
        mushroom: { icon: "🍄", label: "Mushrooms", price: 1.1, pieces: 6, phrase: "Funghi incoming! The forest sent its tastiest delegation." },
        olive: { icon: "🫒", label: "Black olives", price: 0.9, pieces: 7, phrase: "Olive you very much! Luigi has waited all week to say this." },
        basil: { icon: "🌿", label: "Fresh basil", price: 0.7, pieces: 6, phrase: "Fresh basil! Now it smells like an expensive Italian balcony." },
        pineapple: { icon: "🍍", label: "Pineapple", price: 1.3, pieces: 6, phrase: "Pineapple again? Nonna is updating her complaint, but continue!" },
        jalapeno: { icon: "🌶️", label: "Jalapeño", price: 0.8, pieces: 7, phrase: "Piccante! This pizza now argues with the smoke alarm." },
        ketchup: { icon: "🥫", label: "Ketchup zigzag", price: 0.5, pieces: 3, phrase: "Ketchup? Luigi looked away for one second and chaos won." },
        onion: { icon: "🧅", label: "Red onion", price: 0.8, pieces: 7, phrase: "Red onion! Romantic dinner cancelled, delicious dinner confirmed." },
        tomato: { icon: "🍅", label: "Cherry tomatoes", price: 1.0, pieces: 6, phrase: "Pomodori! Tiny tomatoes with enormous main-character energy." },
        prosciutto: { icon: "🥓", label: "Prosciutto", price: 1.9, pieces: 5, phrase: "Prosciutto! Elegant ham wearing an invisible silk scarf." },
        corn: { icon: "🌽", label: "Sweet corn", price: 0.75, pieces: 10, phrase: "Sweet corn! Unexpected, cheerful and impossible to count." },
        shrimp: { icon: "🍤", label: "Garlic shrimp", price: 2.2, pieces: 5, phrase: "Gamberetti! The seafood has entered with excellent posture." },
        garlic: { icon: "🧄", label: "Roasted garlic", price: 0.65, pieces: 8, phrase: "Roasted garlic! Vampires have officially cancelled their reservation." },
        arugula: { icon: "🥬", label: "Rocket leaves", price: 0.85, pieces: 7, phrase: "Rocket leaves! The salad escaped and landed somewhere much more exciting." },
        egg: { icon: "🍳", label: "Sunny egg", price: 1.45, pieces: 1, phrase: "Un uovo! Breakfast and dinner have signed a delicious peace treaty." },
        broccoli: { icon: "🥦", label: "Tiny broccoli", price: 1.05, pieces: 6, phrase: "Broccoli! Your pizza has eaten its vegetables and may now have dessert." },
        sausage: { icon: "🌭", label: "Italian sausage", price: 1.75, pieces: 7, phrase: "Salsiccia! These sausage coins have arrived wearing imaginary moustaches." },
        anchovy: { icon: "🐟", label: "Anchovies", price: 1.55, pieces: 6, phrase: "Anchovies! The Mediterranean just sent a salty little telegram." },
        pepper: { icon: "🫑", label: "Bell pepper", price: 0.95, pieces: 8, phrase: "Peperoni colorati! Red, yellow and green confetti you can actually eat." },
        truffle: { icon: "🟤", label: "Truffle slices", price: 2.6, pieces: 6, phrase: "Truffle! The pizza has suddenly started discussing expensive watches." }
    };

    const batches = {};
    let currentDough = "classic";
    let batchCounter = 0;

    Object.keys(ingredients).forEach(function (name) {
        batches[name] = [];
    });

    function renderIngredientControls() {
        const $grid = $("#ingredientGrid").empty();

        Object.entries(ingredients).forEach(function ([name, ingredient]) {
            const $control = $("<article>", { class: "ingredient-control", "data-control": name });
            const $info = $("<div>", { class: "ingredient-info" }).append(
                $("<span>", { class: "ingredient-icon", text: ingredient.icon }),
                $("<span>").append(
                    $("<strong>").text(ingredient.label),
                    $("<small>").text(`€${ingredient.price.toFixed(2)} / portion`)
                )
            );
            const $quantity = $("<div>", { class: "quantity-control", "aria-label": `${ingredient.label} quantity` }).append(
                $("<button>", { class: "quantity-button minus-button", type: "button", "data-action": "minus", "data-ingredient": name, "aria-label": `Remove one portion of ${ingredient.label}`, text: "−", disabled: true }),
                $("<output>", { id: `quantity-${name}`, class: "quantity-value", text: "0" }),
                $("<button>", { class: "quantity-button plus-button", type: "button", "data-action": "plus", "data-ingredient": name, "aria-label": `Add one portion of ${ingredient.label}`, text: "+" })
            );
            $grid.append($control.append($info, $quantity));
        });
    }

    function randomPosition() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 36;
        return { left: 50 + Math.cos(angle) * radius, top: 50 + Math.sin(angle) * radius };
    }

    function addFlyingBatch(name) {
        const ingredient = ingredients[name];
        const batchId = `${name}-${batchCounter += 1}`;
        batches[name].push(batchId);

        if (name === "ketchup") {
            for (let index = 0; index < ingredient.pieces; index += 1) {
                $("<span>", { class: "ketchup-line", "data-ingredient": name, "data-batch": batchId }).css({
                    top: `${30 + index * 18 + Math.random() * 4}%`,
                    left: `${12 + Math.random() * 10}%`,
                    "--line-rotation": `${index % 2 === 0 ? -15 : 15}deg`,
                    "animation-delay": `${index * 90}ms`
                }).appendTo("#pizzaSurface");
            }
            return;
        }

        for (let index = 0; index < ingredient.pieces; index += 1) {
            const target = randomPosition();
            const startLeft = index % 2 === 0 ? -55 - Math.random() * 30 : 155 + Math.random() * 30;
            const startTop = -30 + Math.random() * 130;
            const rotation = Math.round(Math.random() * 180 - 90);
            const scale = (0.82 + Math.random() * 0.42).toFixed(2);
            const $piece = $("<span>", { class: `ingredient-piece piece-${name}`, "data-ingredient": name, "data-batch": batchId }).css({
                left: `${startLeft}%`, top: `${startTop}%`, "--rotation": `${rotation}deg`, "--piece-scale": scale
            });

            $("#pizzaSurface").append($piece);
            $piece.delay(index * 45).animate({ left: `${target.left}%`, top: `${target.top}%`, opacity: 1 }, 510, function () {
                $(this).addClass("landed");
            });
        }
    }

    function removeLastBatch(name) {
        const batchId = batches[name].pop();
        if (!batchId) return;
        $(`[data-batch="${batchId}"]`).stop(true).fadeOut(240, function () { $(this).remove(); });
    }

    function totalPortions() {
        return Object.values(batches).reduce(function (sum, itemBatches) { return sum + itemBatches.length; }, 0);
    }

    function updateControl(name) {
        const quantity = batches[name].length;
        $(`#quantity-${name}`).text(quantity);
        $(`[data-control="${name}"]`).toggleClass("has-portions", quantity > 0);
        $(`[data-action="minus"][data-ingredient="${name}"]`).prop("disabled", quantity === 0);
    }

    function updateSummary() {
        const dough = doughs[currentDough];
        const $list = $("#selectedList").empty();
        let total = dough.price;
        let ingredientKinds = 0;

        Object.entries(ingredients).forEach(function ([name, ingredient]) {
            const quantity = batches[name].length;
            if (quantity === 0) return;
            ingredientKinds += 1;
            const rowPrice = quantity * ingredient.price;
            total += rowPrice;
            $list.append($("<li>").append(
                $("<span>").text(`${ingredient.label} × ${quantity}`),
                $("<strong>").text(`€${rowPrice.toFixed(2)}`)
            ));
        });

        if (ingredientKinds === 0) $list.append('<li class="empty-selection">No extras yet</li>');

        const portions = totalPortions();
        $("#baseLabel").text(dough.label);
        $("#basePrice").text(`€${dough.price.toFixed(2)}`);
        $("#totalPrice").text(`€${total.toFixed(2)}`);
        $("#toppingCount").text(`${portions} portion${portions === 1 ? "" : "s"}`);
        $("#tasteFill").stop().animate({ width: `${Math.min(100, portions * 6)}%` }, 240);
        $("#pizza").attr("aria-label", `Pizza preview with ${portions} topping portions on ${dough.label}`);

        if (portions === 0) {
            $("#pizzaName").text("La Pizza Timida");
            $("#pizzaSubtitle").text("A shy pizza waiting for personality.");
        } else if (portions <= 3) {
            $("#pizzaName").text("La Pizza Elegante");
            $("#pizzaSubtitle").text("Simple, confident and wearing excellent toppings.");
        } else if (portions <= 8) {
            $("#pizzaName").text("Il Grande Capolavoro");
            $("#pizzaSubtitle").text("A masterpiece with absolutely no indoor voice.");
        } else {
            $("#pizzaName").text("La Torre Infinita");
            $("#pizzaSubtitle").text("Structural engineering has left the kitchen.");
        }
    }

    function say(phrase) {
        $("#chefPhrase").stop(true, true).fadeOut(100, function () { $(this).text(`“${phrase}”`).fadeIn(190); });
    }

    function clearToppings(phrase) {
        Object.keys(batches).forEach(function (name) { batches[name] = []; updateControl(name); });
        $("#pizzaSurface").children().stop(true).fadeOut(220, function () { $(this).remove(); });
        say(phrase);
        updateSummary();
    }

    function selectDough(name, announce) {
        currentDough = name;
        const dough = doughs[name];
        $("#pizza").removeClass("dough-classic dough-thin dough-deep").addClass(dough.className);
        $(".dough-option").removeClass("selected");
        $(`input[name="dough"][value="${name}"]`).closest(".dough-option").addClass("selected");
        if (announce) say(dough.phrase);
        updateSummary();
    }

    renderIngredientControls();
    updateSummary();

    $("#ingredientGrid").on("click", ".quantity-button", function () {
        const name = $(this).data("ingredient");
        if ($(this).data("action") === "plus") {
            addFlyingBatch(name);
            say(ingredients[name].phrase);
        } else {
            removeLastBatch(name);
            say(`One ${ingredients[name].label.toLowerCase()} portion removed. The pizza remains emotionally stable.`);
        }
        updateControl(name);
        updateSummary();
    });

    $('input[name="dough"]').on("change", function () { selectDough($(this).val(), true); });

    $(".pizza-stage").on("mousemove", function (event) {
        const rect = this.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        $("#pizza").css("transform", `rotateX(${54 - y * 13}deg) rotateY(${x * 14}deg) rotateZ(${-2 + x * 4}deg)`);
    }).on("mouseleave", function () {
        $("#pizza").css("transform", "rotateX(54deg) rotateY(0deg) rotateZ(-2deg)");
    });

    $("#clearToppingsButton").on("click", function () {
        clearToppings("Toppings cleared! The dough can finally see the ceiling again.");
    });

    $("#clearEverythingButton").on("click", function () {
        clearToppings("Everything cleared! A clean kitchen, a clean conscience, a suspiciously empty pizza.");
        $('input[name="dough"][value="classic"]').prop("checked", true);
        selectDough("classic", false);
    });

    $("#orderButton").on("click", function () {
        const portions = totalPortions();
        $("#pizza").addClass("celebrate");
        window.setTimeout(function () { $("#pizza").removeClass("celebrate"); }, 700);
        $("#modalMessage").text(portions === 0
            ? "A classic pizza! Minimalism or fear of commitment? Delicious either way."
            : `Your ${doughs[currentDough].label.toLowerCase()} with ${portions} topping portion${portions === 1 ? "" : "s"} has impressed the fictional kitchen.`);
        $("#orderModal").css("display", "grid").hide().fadeIn(220).attr("aria-hidden", "false");
        $("#closeModal").trigger("focus");
    });

    $("#closeModal").on("click", function () {
        $("#orderModal").fadeOut(180).attr("aria-hidden", "true");
        $("#orderButton").trigger("focus");
    });

    $("#orderModal").on("click", function (event) {
        if (event.target === this) $("#closeModal").trigger("click");
    });
});
