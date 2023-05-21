jQuery(document).ready(function ($) {
    $('#myCart').html(getCookie("cart_items"))

    $.ajax({
        type: "GET",
        url: "https://6463c754127ad0b8f8912511.mockapi.io/products",
        success: function(obj) {

            let productEl = $("#products");
            let html = '';
    
            for(let i = 0; i< obj.length; i++) {
                html += "<div class='col-md-4 card-items'>" +
                        "<div class='card'>" + 
                        "<img src ='"+obj[i].product_image +"' alt=''>" +
                        "<div class='card-body'>" +
                            "<h5 class='card-title'>" + obj[i].product_name + "</h5>" +
                            "<p class='card-text'>$" + obj[i].product_price + "</p>" +
                            "<button class='btn btn-primary addToCart add-btn' data-product_id='"+obj[i].id +"' >Add to Cart</button>" +
                            "<button class='btn btn-info seeMore' data-product_id='"+obj[i].id +"' data-toggle='modal' data-target='#seeMoreModal'> See More</button>" +
                            "</div>" +                    
                            "</div>" +
                            "</div>"
            }
    
            productEl.html(html);
        }
    });

    let totalPrice = 0;
    let itemAlreadyAdded = false;

    $(document).on("click", ".addToCart", function() {
       let id = $(this).attr('data-product_id');

       if(!itemAlreadyAdded) {
        $('#myCart').html("<div class='row'>" + 
                                                        "<div class='col-md-9'><h3>Your cart items:</h3></div>" +
                                                        "<div class='col-md-3'><b>Total:</b> $<span id='totalPrice'></span></div>" +     
                                                        "</div>");
    
            itemAlreadyAdded = true;
        }
       
        $.ajax({
            type: "GET",
            url:"https://6463c754127ad0b8f8912511.mockapi.io/products/" + id,
            success: function(obj) {
                
            document.getElementById('myCart').innerHTML += "<div class='row cart-items' id='cart-item-"+obj.id+"'>" +
                                                            "<div class='col-md-4'>" + obj.product_name + "</div>" +
    
                                                            "<div class='col-md-3'><b>Material: </b>" + obj.product_material + "</div>" +
    
                                                            "<div class='col-md-2'><b>Price: </b>$" + obj.product_price + "</div>" +
    
                                                            "<div class='col-md-2'><button data-product_id ='"+obj.id +"' data-product_price = '"+obj.product_price+"' type='button' class='btn btn-danger removeFromCart'>Remove from cart</button></div>" + 
                                                            "</div>";
    
            totalPrice += parseFloat(obj.product_price);
            $('#totalPrice').text(totalPrice);
    
            $('#seeMoreLabel').html("<p>" +  obj.product_name + "</p>") 
    
            setCookie("cart_items", $('#myCart').html(), 5);
            }
        });

    });

    $(document).on("click", ".seeMore", function() {
        let id = $(this).attr("data-product_id");
        $.ajax({
            type: "GET",
            url: "https://6463c754127ad0b8f8912511.mockapi.io/products/" + id,
            success: function(obj) {    
                

            $('#productDetails').html("<p>" +  obj.product_description + "</p>" +
                                                                "<p><b>Material :</b>" + obj.product_material +"</p>" +
                                                                "<p><b>Price : </b>$" + obj.product_price +"</p>")

        $('#seeMoreLabel').html("<p>" +  obj.product_name + "</p>")
                
            }
        })

    })

    $(document).on("click", ".removeFromCart", function() {
        let id = $(this).attr("data-product_id");

        $("#cart-item-" + id).remove();
    
        let total = parseInt($("#totalPrice").text());
        total = total - parseInt(  $(this).attr("data-product_price"));
        $("#totalPrice").text(total);
    
        setCookie("cart_items", $("#myCart").html(), 5)
    })
});

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }