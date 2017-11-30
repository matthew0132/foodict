// Focus = Changes the background color of input to yellow
function replace() {
    document.getElementById("general-search").str.replace = "search", "";
}

$( document ).ready(function() {
    
    $('.mt-0-button').on('click', () => {
        $('#recipe-results').slideToggle();
        console.log("clicked slider");
    });   
    console.log( "ready!" );
    
    var recipeResults = "";
    
    
    
    //getRecipeFromIngredients
    // when the button gets pushed
    
    $('#general-search-submit').click(function(e) {
        
        e.preventDefault();
        var ingredients = "";
        
        ingredients = $('#general-search').val();
        ingredients = ingredients.split(/[ ,]+/).join(',');
        
        // Method that does the API call
        getSearchResultsByIngredients(ingredients);
        
    });
    
    var getSearchResultsByIngredients = function(ingredients) {
        $.ajax({
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + ingredients + "&limitLicense=false&number=5&ranking=1",
            
            
            success: function(result) {
                $('.recipe-item').remove();
                recipeResults = result;
                console.log("Successfully received results: ");
                // Receivles
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
        //var recipeInstructions;

        $.each( recipes, function( key, val ) {
                
            var title = this.title;
            var image = this.image;
            var recipeID = this.id;
            $(".recipe-items").append("<div id='" + recipeID +"' class='media recipe-item' data-recipe-id='" + recipeID + "' data-recipe-title='" + title + "' ><img class='mr-3' src='" + image + "'/><h5 class='recipe-description'>" + title +"</h5></div><div class='recipe-body'></div>");
            getRecipeInstruction(recipeID);
        });
        
        // Starts the function with the event listener for mouse clicks
        
    };
 
    // Method to return directions of recipe
    var getRecipeInstruction = function(recipeID) {
        
        console.log("Getting recipe instructions with the id of :" + recipeID);
        var recipeInstructions = "";
        var recipeTitle = "";
        
        $.ajax({
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"+ recipeID + 
            "/information?includeNutrition=false",
            success: function(recipe) {

                //console.log(recipe.analyzedInstructions[0].steps);
                recipeTitle = recipe.title;
                
                if(recipe.analyzedInstructions.lenghth < 0 ) {
                    recipeInstructions = recipe.instructions;
                    console.log("missing analyzedInstructions");
                }
                else  {
                    console.log("found analyzedInstructions");
                    $.each( recipe.analyzedInstructions[0].steps, function( key, val ) {
                        recipeInstructions += "<div class = 'step-name'>Step " + this.number.toString() + ":<br/>" +  this.step + "<br/></div>";
                    });
                     $("#recipeID").append("Directions for :" + recipeTitle + "<br/>" + recipeInstructions);
                }
                if(recipeInstructions == null)
                    recipeInstructions = "Could not find instructions for this recipe.";
                    
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
    
    /*var makeInstructionsPretty = function(instructions) {
        var fixedInstructions = "";
        console.log(instructions.substring(0,2));
        for(var i = 0; i < instructions.length; i++) {
            if(instructions.charAt(i).isNumeric && instructions.charAt(i+1) == ".") {
                var cut = instructions.substring(i, i+2);
                console.log("Checking if we got the correct thing: " + cut);
                fixedInstructions = instructions.replace(cut, cut + "<br/>");
            }
        }
        displayModal(fixedInstructions);
    }*/
    
       
    // Method to start event listener for mouse clicks
    
    
    var enableRecipeInstructions = function() {
        
        $('.recipe-item').each(function() {
            $(this).click(function(e) {
                // prevents any action from occuring when we click on an element
                e.preventDefault();
                var recipeID = $(this).data('recipe-id');
                var title = $(this).data('recipe-title');
                console.log("Clicked on " + $(this).data('recipe-title'));
                displaySlide(recipeID);
            });
        });
    };
    
    var displaySlide = function(recipeID) {
        console.log("attempting to slide");
        $("#recipe-results").slideToggle("slow");
    };
});
