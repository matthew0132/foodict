// Focus = Changes the background color of input to yellow
function replace() {
    document.getElementById("general-search").str.replace = "search", "";
}

$( document ).ready(function() {
    console.log( "ready!" );
    
    var recipeResults = "";
    
    
    
    // getRecipeFromIngredients
    // when the button gets pushed
    
    $('#general-search-submit').click(function(e) {
        // stop default function
        e.preventDefault();
        
        // variable to hold searchbox input
        var ingredients = "";
        
        // puts searchbox input into ingredients variable and formats it
        ingredients = $('#general-search').val();
        ingredients = ingredients.split(/[ ,]+/).join(',');
        
        // Method that does the API call
        getSearchResultsByIngredients(ingredients);
        
    });
    
    // method that makes api call for recipe search results
    
    var getSearchResultsByIngredients = function(ingredients) {
        $.ajax({
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + ingredients + "&limitLicense=false&number=5&ranking=1",
            
            success: function(result) {
                // removes images if any
                $('.recipe-item').remove();
                recipeResults = result;
                console.log("Successfully received results: ");
                // Receives
                // id, image, imageType, likes, missedIngredeintCount, title, and usedIngredientCount
                console.log(recipeResults);
                console.log("End of getSearchResultsByIngredients ");
            },
            complete: function() {
                // Method that appends each image and title to the page
                displayRecipeResults();
            },
            beforeSend: function(xhr) {
              xhr.setRequestHeader('X-Mashape-Key', 'hU7PJ8uJxgmshl4uBRKdw4rOkNLnp1ec1zFjsnAsAaUKyqyMnM');
              xhr.setRequestHeader('X-Mashape-Host', 'spoonacular-recipe-food-nutrition-v1.p.mashape.com');
            }
      });
    };
    
    
    //Method that appends each recipe's image and title
    var displayRecipeResults = function() {
        var recipes = recipeResults;
        $.each( recipes, function( key, val ) {
                
            var title = this.title;
            var image = this.image;
            var recipeID = this.id;
            
            // appends image and title to output
            $(".recipe-items").append("<div id='" + recipeID +"' class='media recipe-item' data-recipe-id='" + recipeID + "' data-recipe-title='" + title + "' ><img class='mr-3' src='" + image + "'/><h5 class='recipe-description'>" + title +"</h5></div><div class='recipe-body'></div>");
            
            // method that makes API call to get other details for recipes
            getRecipeInstruction(recipeID);
        });
        
        // Starts the function with the event listener for mouse clicks
        
    };
 
    // Method to return directions of recipe
    var getRecipeInstruction = function(recipeID) {
        
        console.log("Getting recipe instructions with the id of :" + recipeID);
        var recipeInstructions = "";
        var recipeTitle = "";
        var ingredients = "Ingredients:<br/>";
        $.ajax({
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"+ recipeID + 
            "/information?includeNutrition=false",
            success: function(recipe) {
                recipeTitle = recipe.title;
                // try to get to use analyzedInstructions
                try{
                    console.log("found analyzedInstructions");
                    
                    // concatenates all ingredients into the ingredients variable
                    $.each(recipe.extendedIngredients, function(key, val) {
                       ingredients += this.originalString + "<br/>";
                    });
                    
                    // creates div for ingredients, identified by the class ingredients hidden and the id ingredients"RecipeID"
                    $("#"+recipeID).append("<div class='ingredients hidden' id='ingredients"+recipeID+"'>" + ingredients +"</div>");
                    
                    // concatenates each step into a separate div
                    $.each( recipe.analyzedInstructions[0].steps, function( key, val ) {
                        recipeInstructions += "<div class = 'step-name'>Step " + this.number.toString() + ":<br/>" +  this.step + "<br/></div>";
                    });
                    
                    // creates div for instructions, identified by the class instructions hidden and the id recipe"RecipeID"
                    $("#"+recipeID).append("<div class='instructions hidden' id='recipe"+recipeID+"'>" + recipeInstructions +"</div>");
                }
                // if error for analyzed instructions is thrown, act as instructions are missing
                catch(e){
                    recipeInstructions = "Instructions for this recipe are missing.";
                    console.log("missing analyzedInstructions");
                    $.each(recipe.extendedIngredients, function(key, val) {
                       ingredients = this.originalString;
                       $("#"+recipeID).append("<div class='ingredients hidden' id='ingredients"+recipeID+"'>" + ingredients +"</div>");
                    });
                    $("#"+recipeID).append("<div class='instructions hidden' id='recipe"+recipeID+"'>" + recipeInstructions +"</div>");
                }
            },
            complete: function() {
                enableRecipeInstructions();
            },
            
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-Mashape-Key', 'hU7PJ8uJxgmshl4uBRKdw4rOkNLnp1ec1zFjsnAsAaUKyqyMnM');
                xhr.setRequestHeader('X-Mashape-Host', 'spoonacular-recipe-food-nutrition-v1.p.mashape.com');
            }
        });
    }
       
    // Method to start event listener for mouse clicks

    var enableRecipeInstructions = function() {
        
        $('.recipe-item').click(function(e){
            e.preventDefault();
            var recipeID = $(this).data('recipe-id');
            var title = $(this).data('recipe-title');
            displaySlide(recipeID);
            console.log("sliding directions of recipeID: "+recipeID);
        });
        

    };
    
    
    // Method that concatenates the div instructions ID and slides 
    
    var displaySlide = function(recipeID) { 
        var name = "#recipe" + recipeID; 
        var ingredientName = "#ingredients" + recipeID;
        $(name).toggleClass("hidden");
        $(ingredientName).toggleClass("hidden");
        /* Don't use slideToggle, as it may be triggered everytime you're adding to that element within the dom. */
        /* We can use a class called hidden to be used to hide elements, and simply toggle said class if we wanted content to appear or disappear when needed. */
    };
});

