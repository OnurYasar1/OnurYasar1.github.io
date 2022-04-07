/*
*	 Author: Onur YAŞAR
*/



// İlk OOP Denemem
class PreviewPlayer{
    constructor(previewAudio) {
        this.isPlaying = false;
        this.previewAudio = previewAudio;
        this.previewAudio.volume = 0.5;
    }
    
    toggle(){
        if(this.isPlaying){
            $('#pp-preview span').addClass('ion-play');
            $('#pp-preview span').removeClass('ion-pause');
            this.previewAudio.pause();
            this.isPlaying = false;
        }else{
            $('#pp-preview span').removeClass('ion-play');
            $('#pp-preview span').addClass('ion-pause');
            this.previewAudio.play();
            this.isPlaying = true;
        }
    }
    
    stopped(){
        this.isPlaying = false;
        $('#pp-preview span').addClass('ion-play');
        $('#pp-preview span').removeClass('ion-pause');
    }
    
    reload(url){
        this.previewAudio.src = url;
        this.previewAudio.load();
        this.previewAudio.currentTime = 0;
        this.isPlaying = false;
        $('#pp-preview span').addClass('ion-play');
        $('#pp-preview span').removeClass('ion-pause');
    }
    
    destroy(){
        this.previewAudio.pause();
        this.isPlaying = false;
        $('#pp-preview span').addClass('ion-play');
        $('#pp-preview span').removeClass('ion-pause');
    }
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

	if(elapsed < 0){
		elapsed += 115000;
	}

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' saniye önce';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' dakika önce';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' saat  önce';   
    }

    else if (elapsed < msPerMonth) {
        return 'Yaklaşık ' + Math.round(elapsed/msPerDay) + ' gün önce';   
    }

    else if (elapsed < msPerYear) {
        return 'Yaklaşık ' + Math.round(elapsed/msPerMonth) + ' ay önce';   
    }

    else {
        return 'Yaklaşık ' + Math.round(elapsed/msPerYear ) + ' yıl önce';   
    }
}


var tdInterval = false;
let previewPlayer = new PreviewPlayer(document.getElementById("song-preview"));

function tdCSong(timestamp){
    $('#cdate').html(timeDifference(Date.now(), timestamp));
}

function getCurrently(){
    $.get('getLastSong.php', {
        currently:true
    }, function (data, status){
       var csong = JSON.parse(data);
       if(csong.artists === null) return false;
       if(csong.trackLink != $('#go-spoti').attr('href')){
            $('.listened-music').animate({opacity: '0.1'}, 500, ()=>{
                $('#go-spoti').attr('href', csong.trackLink);
                $('#img-spoti').attr('href', csong.trackLink);
                $('#song-name').text(csong.trackName);
                $('#artist-name').text(csong.artists.map((e)=>{
                    return e.name
                }).join(', '));
                $('#img-spoti img').attr('src', csong.trackCover);
                
                if(csong.previewUrl === null){
                    $('#img-spoti').show();
                    $('#spoti-preview').hide();
                    previewPlayer.destroy();
                }else{
                    $('#img-spoti').hide();
                    $('#spoti-preview').attr('style', "background: url('"+csong.trackCover+"');");
                    $('#spoti-preview').show();
                    previewPlayer.reload(csong.previewUrl);
                }
                
                $('.listened-music').animate({opacity: '1'}, 500);
            });
       }
       
       if(csong.isPlaying){
           $('#cdate').html('<img src="https://onuryasar.online/images/playing.gif"> <br> Şuan çalıyor...');
           clearInterval(tdInterval);
           tdInterval = false;
       }else{
           if(!tdInterval) {tdInterval = setInterval(function(){tdCSong(csong.timestamp);}, 1000);}
       }
    });
}

$('#pp-preview').click(function(){
    previewPlayer.toggle();
});


document.getElementById("song-preview").onpause = function() {
  previewPlayer.stopped();
};

$(window).on("load", function() {
	var preload = $('.preloader');
	preload.find('.spinner').fadeOut(function(){
		preload.fadeOut();
	});
	
	// Developer Message
	console.log("--------------------------------------------------------------------");
    console.log("Hey! Demek buradasın! O zaman sen de bir geliştiricisin :)");
    console.log("Kodları incelerken iyi eğlenceler :D");
    console.log("--------------------------------------------------------------------");
    
    // Connecting Main Algorithm API
    $.post('algorithm.php', {
        isGetcontact: true
        },
        function(data, status){
            $('#comments-list').html(data);
            $('.fa-heart').click(function(){
                var golia = $(this);
                var id = golia.attr('data-kimlik');
                var newp = parseInt($(this).text())+1;
                if(!localStorage.getItem('puan-'+id)){
                    $.post('algorithm.php', {
                        isPuan: true,
                        puan: newp,
                        id: id
                    }, 
                        function (datp){
                            if(datp == 'success'){
                                localStorage.setItem('puan-'+id, true);
                                golia.html('&nbsp;&nbsp;'+newp);
                            }
                        });
                    }
        });
                
     });
    
    getCurrently();
    setInterval(getCurrently, 5000);
});

$(function () {
	'use strict';
	
	
	/*
		Vars
	*/
	
	var width = $(window).width();
	var height = $(window).height();
	
	
	/*
		Header Menu Desktop
	*/
	
	var container = $('.container');
	var card_items = $('.card-inner');
	var animation_in = container.data('animation-in');
	var animation_out = container.data('animation-out');
	
	$('.top-menu').on('click', 'a', function(){

		/* vars */
		var width = $(window).width();
		var id = $(this).attr('href');
		var h = parseFloat($(id).offset().top);
		var card_item = $(id);
		var menu_items = $('.top-menu li');
		var menu_item = $(this).closest('li');
		var d_lnk = $('.lnks .lnk.discover');

		if((width >= 1024)) {
			
			/* if desktop */
			if(!menu_item.hasClass('active') & (width > 1023) & $('#home-card').length) {

				/* close card items */
				menu_items.removeClass('active');
				container.find(card_items).removeClass('animated '+animation_in);

				if($(container).hasClass('opened')) {
					container.find(card_items).addClass('animated '+animation_out);
				}

				/* open card item */
				menu_item.addClass('active');
				container.addClass('opened');
				container.find(card_item).removeClass('animated '+animation_out);
				container.find(card_item).addClass('animated '+animation_in);
				
				$(card_items).addClass('hidden');
				
				$(card_item).removeClass('hidden');
				$(card_item).addClass('active');
			}
		}
		/* if mobile */
		if((width < 1024) & $('#home-card').length) {

			/* scroll to section */
			$('body,html').animate({
				scrollTop: h - 76
			}, 800);
		}
		return false;
	});

	$(window).on('resize', function(){
		var width = $(window).width();
		var height = $(window).height();

		if((width < 1024)) {
			$('.card-inner').removeClass('hidden');
			$('.card-inner').removeClass('fadeOutLeft');
			$('.card-inner').removeClass('rotateOutUpLeft');
			$('.card-inner').removeClass('rollOut');
			$('.card-inner').removeClass('jackOutTheBox');
			$('.card-inner').removeClass('fadeOut');
			$('.card-inner').removeClass('fadeOutUp');
			$('.card-inner').removeClass('animated');

			$(window).on('scroll', function(){
				var scrollPos = $(window).scrollTop();
				$('.top-menu ul li a').each(function () {
					var currLink = $(this);
					var refElement = $(currLink.attr("href"));
					if (refElement.offset().top - 80 <= scrollPos) {
						$('.top-menu ul li').removeClass("active");
						currLink.closest('li').addClass("active");
					}
				});
			});

			$('.card-inner .card-wrap').slimScroll({destroy: true});
			$('.card-inner .card-wrap').attr('style', '');
		}
		else {
			$($('.top-menu li.active a').attr('href')).addClass('active');
			$('.card-inner .card-wrap').slimScroll({
				height: '570px'
			});
		}
	});
	
	
	/*
		Smoothscroll
	*/
	
	if((width < 1024) & $('#home-card').length) { 
		$(window).on('scroll', function(){
			var scrollPos = $(window).scrollTop();
			$('.top-menu ul li a').each(function () {
				var currLink = $(this);
				var refElement = $(currLink.attr("href"));
				if (refElement.offset().top - 80 <= scrollPos) {
					$('.top-menu ul li').removeClass("active");
					currLink.closest('li').addClass("active");
				}
			});
		});
	}
	
	
	/*
		slimScroll
	*/
	
    if(width > 1024) {
        $('.card-inner .card-wrap').slimScroll({
            height: '570px'
        });
    }
	
	
	/*
		Hire Button
	*/
	
	$('.lnks').on('click', '.lnk.discover', function(){
		$('.top-menu a[href="#contacts-card"]').trigger('click');
	});
    
    $('.theme_panel .toggle_bts').on('click', 'a', function(){
		if($(this).hasClass('active')) {

			$(this).removeClass('active');
            $('.theme_panel').removeClass('active');
			
			return false;
		}
		else {

			$(this).addClass('active');
            $('.theme_panel').addClass('active');
		}
	});
    
    $('.theme_panel .layout_style').on('click', 'a', function(){
		var color = $(this).attr('data-color');
        
        $('head').append('<link rel="stylesheet" href="css/template-colors/'+color+'.css" />');
	});
    
    $('.theme_panel .dark_style').on('click', 'a', function(){
		var dark = $(this).attr('data-dark');
        
        if(dark == 'dark') {
            $('head').append('<link rel="stylesheet" href="css/template-dark/dark.css" />');
        }
        else {
            $('link[href="css/template-dark/dark.css"]').remove();
        }
	});
	
	
	/*
		Initialize masonry items
	*/
	
	

	/*
		12. Initialize masonry filter
	*/
	
	$('.filter-button-group').on('change', 'input[type="radio"]', function() {
		if ($(this).is(':checked')) {
			$('.f_btn').removeClass('active');
			$(this).closest('.f_btn').addClass('active');
		}
		/* popup image */
		$('.has-popup-image').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			mainClass: 'popup-box',
			image: {
				verticalFit: true
			}
		});
	
		/* popup video */
		$('.has-popup-video').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false,
			mainClass: 'popup-box'
		});
	
		/* popup music */
		$('.has-popup-music').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false,
			mainClass: 'popup-box'
		});
	
		/* popup media */
		$('.has-popup-media').magnificPopup({
			type: 'inline',
			overflowY: 'auto',
			closeBtnInside: true,
			mainClass: 'popup-box-inline'
		});
	});
	
	
	/*
		Popups
	*/
	
	/* popup image */
	$('.has-popup-image').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		mainClass: 'popup-box',
		image: {
			verticalFit: true
		}
	});
	
	/* popup video */
	$('.has-popup-video').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'popup-box'
	});
	
	/* popup music */
	$('.has-popup-music').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'popup-box'
	});
	
	/* popup media */
	$('.has-popup-media').magnificPopup({
		type: 'inline',
		overflowY: 'auto',
		closeBtnInside: true,
		mainClass: 'popup-box-inline',
		callbacks: {
			open: function() {
				$('.popup-box-inline .popup-box').slimScroll({
					height: height+'px'
				});
			}
		}
	});
	
	
	/*
		Validate Contact Form
	*/
	
	$("#cform").validate({
		ignore: ".ignore",
		rules: {
			name: {
				required: false
			},
			message: {
				required: true
			},
			email: {
				required: false,
				email: true
			}
		},
		success: "valid",
		submitHandler: function() {
            var gorunsunmu = 1;
            var namel = 'Anonim';
            var textm = $("#cform").find('textarea[name="message"]').val();
            if ($("#cform").find('input[name="iltygm"]').is(":checked")){
                gorunsunmu = 0;
            }else{
                gorunsunmu = 1;
                
                if($("#cform").find('input[name="name"]').val() != ''){
                   namel = $("#cform").find('input[name="name"]').val();
                }
                
                var ekleileti = '<li style="display:none;">'+
                '    <div class="comment-main-level">'+
                '        <!-- Avatar -->'+
                '        <div class="comment-avatar"><img src="images/avatar.png" alt=""></div>'+
                '        <div class="comment-box">'+
                '            <div class="comment-head">'+
                '                <h6 class="comment-name">'+namel+'</h6>'+
                '                <span>Şimdi</span>'+
                '            </div>'+
                '            <div class="comment-content">'+
                '               '+textm+
                '            </div>'+
                '        </div>'+
                '    </div>'+
                '</li>';
                $('#comments-list').append(ekleileti);
                
                $('#comments-list li').delay(1500).last().slideDown(800);
            }
            
            $.post('algorithm.php', {
                isContact: true,
                isReply: 0,
                name: $("#cform").find('input[name="name"]').val(),
                email: $("#cform").find('input[name="email"]').val(),
                isGorunsun: gorunsunmu,
                message: $("#cform").find('textarea[name="message"]').val()
            },
            function(data, status){
                console.log(data);
                if(data == 'success'){
                    $('#cform').fadeOut(800);
                    $('.alert-success').delay(1000).fadeIn();
                }else if(data.substring(0,6) == 'failed'){
                    $('#cform').fadeOut(800);
                    $('.alert-failed').delay(1000).fadeIn();
                }
            });
		}
	});
	
	
	/*
		Validate Commect Form
	*/
	
	$("#comment_form").validate({
		rules: {
			message: {
				required: true
			}
		},
		success: "valid",
		submitHandler: function() {
		}
	});


	// right click image
	$('body').on('contextmenu', 'img', function(e){
		return false; 
	});

});
