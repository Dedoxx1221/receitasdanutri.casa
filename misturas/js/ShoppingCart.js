var mini_cart_timeout = null;
function config_mini_cart(){
	$('.header-mini-cart .btn-show-cart').click( function() {
		$('.mini-cart').fadeIn(400);
		//clearTimeout(mini_cart_timeout);
		return false;
	});
	$('.mini-cart .close, .mini-cart .overlay').click(function(){
		$('.mini-cart').fadeOut(400);
		return false;
	});
}

function update_mini_cart(){
	var tmp_options = {	
		method: 'POST', 
		url: $('#customer-url').val() + '/mini-cart', 
		data: {}, 
		dataType: 'html'
	};
	
	tmp_options.success = function (html) {
		$('div.mini-cart-panel').html(html);
		config_mini_cart();
	};
	
	$.ajax(tmp_options);
	return false;
}


$(document).ready(function(){
	
	$('.mini-cart').hide();	
	$('.add-to-cart').each(function(){
		
		$(this).click(function(){
			var btnAdd = $(this);
			if(btnAdd.hasClass('disabled'))
				return false;
			btnAdd.addClass('disabled');
			if($("#field-quantity").val() <= 0 ) return false;
			var tmp_options = {	
				method: 'POST', 
				url: btnAdd.attr('href'), 
				data: { 'product_dcm_quantity' : $("#field-quantity").val() }, 
				dataType: 'json',
				success: function(json) {
					if(!json.success) alert(json.msg);
					else window.location = $('#customer-url').val() + '/cart' 
				},
				error: function(){ 
					alert('Não foi possível adicionar o item ao carrinho!'); 
					btnAdd.removeClass('disabled'); 
				}
			};
			$.ajax(tmp_options);
			return false;
		});
		
	});
	$('.update-cart').each(function(){
		if($($(this).attr('for')).val() <= 1 && $(this).hasClass('less')) $(this).addClass('disabled');
		else if($(this).hasClass('less')) $(this).removeClass('disabled');
		$(this).click(function(){
			var btnAdd = $(this);
			if(btnAdd.hasClass('disabled')) return false;

			btnAdd.addClass('disabled');
			
			var qtt = ($($(this).attr('for')).val() * 1);
			var quantity = $(this).hasClass('less') ? -1 : 1;
			
			if((qtt + quantity) > 0){
				$.ajax({
					method: 'POST',
					url: btnAdd.attr('href'),
					data: { 'product_dcm_quantity' : quantity },
					dataType: 'json',
					success: function (json) {
						alert(json.msg);
						btnAdd.removeClass('disabled');
						update_mini_cart();
						if(json.success){
							window.location = window.location;
							$(btnAdd.attr('for')).val((qtt + quantity));
						}
					}
				});
			}
			return false;
		});
	});
	config_mini_cart();
});
