$(function () {
    const basePrice = 8.9;
    const selected = new Set();

    const ingredients = {
        cheese: {
            label: "Extra mozzarella",
            price: 1.2,
            pieces: 12,
            phrase: "Mamma mia! This mozzarella arrived with more confidence than my cousin at karaoke."
        },
        pepperoni: {
            label: "Pepperoni",
            price: 1.6,
            pieces: 9,
            phrase: "Bellissimo! Tiny pepperoni medals for your excellent decisions."
        },
        mushroom: {
            label: "Mushrooms",
            price: 1.1,
            pieces: 8,
            phrase: "Funghi! The forest called. I told it we are busy making dinner."
        },
        olive: {
            label: "Black olives",
            price: 0.9,
            pieces: 9,
            phrase: "Olive you very much! Yes, Luigi rehearsed that joke all morning."
        },
        basil: {
            label: "Fresh basil",
            price: 0.7,
            pieces: 8,
            phrase: "Fresh basil! Now the pizza smells like a holiday it cannot afford."
        },
        pineapple: {
            label: "Pineapple",
            price: 1.3,
            pieces: 8,
            phrase: "Pineapple?! Nonna dropped a wooden spoon, but your courage is magnificent."
        },
        jalapeno: {
            label: "Jalapeño",
            price: 0.8,
            pieces: 9,
            phrase: "Piccante! This pizza now has opinions and is not afraid to share them."
        },
        ketchup: {
            label: "Ketchup zigzag",
            price: 0.5,
            pieces: 4,
            phrase: "Ketchup on pizza? Luigi is breathing into a paper bag, but we continue!"
        }
    };

    function randomPosition() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 36;
        return {
            left: 50 + Math.cos(angle) * radius,
            top: 50 + Math.sin(angle) * radius
        };
    }

    function addFlyingPieces(name) {
        const ingredient = ingredients[name];

        if (name === "ketchup") {
            for (let index = 0; index < ingredient.pieces; index += 1) {
                const $line = $("<span>", {
                    class: "ketchup-line",
                    "data-ingredient": name
                }).css({
                    top: `${28 + index * 14}%`,
                    "--line-rotation": `${index % 2 === 0 ? -14 : 14}deg`,
                    "animation-delay": `${index * 90}ms`
                });
                $("#pizzaSurface").append($line);
            }
            return;
        }

        for (let index = 0; index < ingredient.pieces; index += 1) {
            const target = randomPosition();
            const startLeft = index % 2 === 0 ? -55 - Math.random() * 25 : 155 + Math.random() * 25;
            const startTop = -35 + Math.random() * 130;
            const rotation = Math.round(Math.random() * 180 - 90);

            const $piece = $("<span>", {
                class: `ingredient-piece piece-${name}`,
                "data-ingredient": name
            }).css({
                left: `${startLeft}%`,
                top: `${startTop}%`,
                "--rotation": `${rotation}deg`
            });

            $("#pizzaSurface").append($piece);
            $piece
                .delay(index * 55)
                .animate({
                    left: `${target.left}%`,
                    top: `${target.top}%`,
                    opacity: 1
                }, 520, function () {
                    $(this).addClass("landed");
                });
        }
    }

    function removeIngredient(name) {
        $(`[data-ingredient="${name}"]`, "#pizzaSurface")
            .stop(true)
            .fadeOut(260, function () {
                $(this).remove();
            });
    }

    function updateSummary() {
        const $list = $("#selectedList").empty();
        let total = basePrice;

        if (selected.size === 0) {
            $list.append('<li class="empty-selection">No extras yet</li>');
        } else {
            selected.forEach(function (name) {
                const item = ingredients[name];
                total += item.price;
                $list.append(
                    $("<li>").append(
                        $("<span>").text(item.label),
                        $("<strong>").text(`€${item.price.toFixed(2)}`)
                    )
                );
            });
        }

        const count = selected.size;
        $("#totalPrice").text(`€${total.toFixed(2)}`);
        $("#toppingCount").text(`${count} / 8`);
        $("#tasteFill").stop().animate({ width: `${(count / 8) * 100}%` }, 280);
        $("#pizza").attr("aria-label", `Pizza preview with ${count} extra ingredients`);

        if (count === 0) {
            $("#pizzaName").text("La Pizza Timida");
            $("#pizzaSubtitle").text("A shy pizza waiting for personality.");
        } else if (count <= 2) {
            $("#pizzaName").text("La Pizza Elegante");
            $("#pizzaSubtitle").text("Simple, confident and wearing excellent toppings.");
        } else if (count <= 5) {
            $("#pizzaName").text("Il Grande Capolavoro");
            $("#pizzaSubtitle").text("A masterpiece with absolutely no indoor voice.");
        } else {
            $("#pizzaName").text("La Torre di Toppings");
            $("#pizzaSubtitle").text("Structurally questionable. Emotionally perfect.");
        }
    }

    function say(phrase) {
        $("#chefPhrase").stop(true, true).fadeOut(120, function () {
            $(this).text(`“${phrase}”`).fadeIn(220);
        });
    }

    $(".ingredient-button").on("click", function () {
        const name = $(this).data("ingredient");
        const isSelected = selected.has(name);

        if (isSelected) {
            selected.delete(name);
            removeIngredient(name);
            $(this).attr("aria-pressed", "false");
            say(`${ingredients[name].label} removed. The pizza says it understands, but it needs time.`);
        } else {
            selected.add(name);
            addFlyingPieces(name);
            $(this).attr("aria-pressed", "true");
            say(ingredients[name].phrase);
        }

        updateSummary();
    });

    $("#resetButton").on("click", function () {
        selected.clear();
        $("#pizzaSurface").children().stop(true).fadeOut(230, function () {
            $(this).remove();
        });
        $(".ingredient-button").attr("aria-pressed", "false");
        say("Clean dough! A fresh beginning, like Monday but with better consequences.");
        updateSummary();
    });

    $("#orderButton").on("click", function () {
        const count = selected.size;
        $("#pizza").removeClass("celebrate");
        void document.getElementById("pizza").offsetWidth;
        $("#pizza").addClass("celebrate");

        $("#modalMessage").text(
            count === 0
                ? "A classic pizza! Minimalism or fear of commitment? Delicious either way."
                : `Your pizza with ${count} extra ingredient${count === 1 ? "" : "s"} has impressed the fictional kitchen.`
        );
        $("#orderModal").css("display", "grid").hide().fadeIn(220).attr("aria-hidden", "false");
        $("#closeModal").trigger("focus");
    });

    $("#closeModal").on("click", function () {
        $("#orderModal").fadeOut(180).attr("aria-hidden", "true");
        $("#orderButton").trigger("focus");
    });

    $("#orderModal").on("click", function (event) {
        if (event.target === this) {
            $("#closeModal").trigger("click");
        }
    });
});
