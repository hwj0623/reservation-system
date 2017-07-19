
 var slideIndex=1;

 (function (){
 	var detailUrl = '/booking/bizes';
 	var imgUrl = detailUrl+'/image';
 	var countUrl = detailUrl+'/count';
 	var productInfoUrl= detailUrl+'/info';
 	var productDetailUrl = detailUrl+'/pdetail';
 	var displayUrl = detailUrl+'/display';
 	var commentUrl = detailUrl+'/comment';
 	var avgUrl = detailUrl+'/avgscore';
 	var countCommentUrl = detailUrl+'/commentnum';
 	var reviewsUrl = detailUrl+'/reviewMore';
 	//url로부터 productId값 읽어오기 
 	var urlParsing = location.href.replace(/[^(\/a-zA-Z0-9)]/gi,"").split('/');
 	var id = urlParsing[urlParsing.length-1];

 	//for slide
 	var listSize = 0;
 
 	//$('ul.visual_img').css("width","414px");
 	var size = $('.container_visual').outerWidth();
 	var totalSize ;
 	//console.log("size "+size);
 	//$('ul.visual_img').
 	//lazy loading
 	$(window).scroll(function(){
			var $current = $(window);
			var $mazinoLine =$(document).height();
			//console.log($mazinoLine - $current.height() );
			//console.log("right: "+$current.scrollTop());
			if($mazinoLine - $current.height() <= $current.scrollTop()*3){
				var imgsrc = $('.in_img_lst').find('[data-lazy-image]').attr('data-lazy-image');
				$('.in_img_lst').find('[data-lazy-image]').attr("src",imgsrc);
				$('.in_img_lst').find('[data-lazy-image]').removeAttr("data-lazy-image");
			}
	});

	$('.logo').on("click", ".ico_n_logo",function(e){
			location.href="https://m.naver.com";
	});
	$('.logo').on("click", ".ico_bk_logo", function(e){
			location.href="/";
	});
	$('.btn_my').on("click",  function(e){
			location.href="/my";
	});
	//펼쳐보기, 접기
	$('.bk_more._open').on("click",  function(e){
			$('.bk_more._open').css("display","none");
			$('.bk_more._close').css("display","");
			$('.section_store_details').find('.store_details').removeClass('close3');
	});
	$('.bk_more._close').on("click",  function(e){
			$('.bk_more._close').css("display","none");
			$('.bk_more._open').css("display","");
			$('.section_store_details').find('.store_details').addClass('close3');
	});
	
	//----
	function getProductInfo(getProductUrl, id){
		$.ajax({
			method:"GET",
			url:getProductUrl,
			data:{id:id},
			success:function(data){
				console.log("data다");
				console.log(data);
				var pTitle = '<span>'+data.name+'</span>';
				var pDsc = '<p class="visual_txt_dsc">'+data.description+'</p>';

				$('.container_visual li:eq(0)').find('.visual_txt_tit').append(pTitle);
				$('.container_visual li:eq(0)').find('.visual_txt_dsc').append(pDsc);
				$('.store_details').find('.dsc').text(data.description).val();
				//sales_flag 저장.
				$('.section_btn').find('.bk_btn').attr("data-sales",data.salesFlag);
				$('.section_btn').find('i.fn-nbooking-calender2').attr("data-sales-date",data.salesEnd);

				//해당 전시에 이벤트가 있다면 이벤트 정보를 노출해준다.
				if(data.event!==null){
					$('.section_event').find('.in_dsc').text(data.event).val();
				}

			}
		});
	}
	//-----
	//메인이미지, 서브 이미지 모두 불러오기.
	function getProductImageList(getImagesUrl, id){
		$.ajax({
			method:"GET",
			url: getImagesUrl,
			data:{id:id},
			success: function(data){
				var idx =0;
				listSize = data.length;	

				$('.container_visual').css("width", listSize*size+"px");
				//console.log("length: "+data.length);
				$.each(data, function(){
					var item = '<li class="item" style="width: 414px;"> '
								+'<img alt="" class="img_thumb" src="'+'/imgresources'+data[idx].saveFileName 
								+'" > <span class="img_bg"></span>'
								+'<div class="visual_txt">'
								+'<div class="visual_txt_inn">'
	                            +'<h2 class="visual_txt_tit"> </h2>'
	                            +'<p class="visual_txt_dsc"></p>'
                                +'</div>'
                                +'</div>'
                                +'</li>'
                    $('.container_visual').find('.visual_img').append(item);
                    //<!-- [D] 첫 이미지 이면 off 클래스 추가 -->
                   
                  	idx++;
  					$('.btn_prev').find('.spr_book2.ico_arr6_lt').addClass('off');

                    if(data.length===1){
                    	//console.log('length is : 1');
                    	$('.group_visual').find('.prev').remove();
                    	$('.group_visual').find('.nxt').remove();
                    }
				});
			},
			error:function(data){
					alert("failed to load images ");
			}	
		});
		getProductInfo( productInfoUrl, id);
	};
	getProductImageList(imgUrl, id);

	//댓글 
	function getThreeComentList(getCommentUrl, id){
		$.ajax({
			method:"GET",
			url:getCommentUrl,
			data:{id:id},
			success:function(data){	
				//console.log(data.length);
				var idx = 0;
				console.log("date length");
				console.log(data);
				$.each(data, function(){
					var userNameInitial = data[idx].userName;
					userNameInitial = userNameInitial.substring(0,4)+"****";
					var date = data[idx].create_date.split('-');
					if(date[1]<10) date[1] = date[1]%10;
					var visit = date[0]+'.'+date[1]+'.'+date[2]+'.'+' 방문';

					var item = '<li class="list_item">'
                                +'<div>'
                                +'<div class="review_area">'
                                +'<div class="thumb_area">'
                                +'</div>'
                                +'<h4 class="resoc_name">'+data[idx].productName+'</h4>'
                                +'<p class="review">'+data[idx].comment+'</p>'
                                +'</div>'
                                +'<div class="info_area">'
                                +'<div class="review_info"> <span class="grade">'+data[idx].score+'</span> '
                                +'<span class="name">'+userNameInitial+'</span>'
                                +'<span class="date">'+visit+'</span> </div>'
                                +'</div></div></li>'
                    $('.list_short_review').append(item);
					$('.review_box li.list_item').eq(idx).find('p.review').html();
					//img가 존재한다면 thumbnail로 넣기 
					if(data[idx].imgList.length!=0){
					
						var imgItem = '<a href="#" class="thumb" title="이미지 크게 보기"> '
						+'<img width="90" height="90" class="img_vertical_top" src="'
						+'/imgresources'+data[idx].imgList[0].save_file_name  +'" alt="리뷰이미지"> '
						+'</a><span class="img_count">'+data[idx].imgList.length+'</span> '
						$('.list_item').eq(idx).find('.thumb_area').append(imgItem);
					}
					idx++;
				})
			}
		});
	};
	getThreeComentList(commentUrl,id);

	//Layer PopUp Event
	function wrap(){
		console.log("wrap");
		var popUpHeight = $(document).height();
		var popUpWidth = $(document).width();
		$('.pop_up_layer').css({"width":popUpWidth, "height":popUpHeight, "display":"block"});
		var button = '<li></li>';
		$('.pop_up_layer').append(button);
		var imgList = '<div class="section_visual">'
				         +'<a href="#" class="lnk_logo" title="네이버">' 
				         +'<span class="spr_bi ico_n_logo">네이버</span>'
				         +'</a>'
		                 +'<div class="group_visual">'
		                 +'<div>'
		                 +'<div class="container_visual" style="width: 414px;">'
		                 +'<ul class="visual_img">'
		                 +'</ul>'
		                 +'</div>'
		                 +'<div class="prev">'
		                 +'<div class="prev_inn">'
		                 +'<a href="#" class="btn_prev" title="이전">'
		                                    //<!-- [D] 첫 이미지 이면 off 클래스 추가 -->
		                 +'<i class="spr_book2 ico_arr6_lt "></i>'
		                 +'</a>'
		                 +'</div>'
		                 +'</div>'
		                 +'<div class="nxt">'
		                 +'<div class="nxt_inn">'
		                 +'<a href="#" class="btn_nxt" title="다음">'
		                 +'<i class="spr_book2 ico_arr6_rt"></i>'
		                 +'</a> </div> </div> </div> </div>';












	};
	$('.section_review_list').on("click",'.thumb', function(e){
		console.log(this);
		console.log("dd");
		e.preventDefault();
		wrap();

	});


	$('.pop_up_layer').on('click',function(){
		$(this).hide();
	});





	//$(('.thumb')
	//평균 스코어
	function getAverageScore(getAvgUrl, id){
		$.ajax({
			method:"GET",
			url:getAvgUrl,
			data:{id,id},
			success:function(data){
				console.log("avgscore");
				console.log(data);

				$('.grade_area').find('.text_value > span').text(data);//.val();
				var graphBar = (data * 20)+"%" ;
				$('.grade_area').find('.graph_value').css("width", graphBar);
			}
		});
	};
	//전체 코멘트
	function getCountComment(getCntUrl, id){
		$.ajax({
			method:"GET",
			url:getCntUrl,
			data:{id,id},
			success:function(data){
				$('.grade_area').find('.join_count > em').text(data+"건").val();
				$('.btn_review_more').attr("href",detailUrl+"/reviewMore/"+id);
				if(data<=3){
					$('.section_review_list').find('.btn_review_more').addClass('hide');
				}
			}
		});
	};
	getAverageScore(avgUrl, id);
	getCountComment(countCommentUrl,id);
	// button slide
	function slideShow (length){
			$('ul.visual_img').animate({"margin-left": -length}, 100);
	};
	function manualSlide(n) {

		slideIndex +=n;
		
		if(slideIndex > listSize){
			  slideIndex =1;
		}
		if(slideIndex <1){
			  slideIndex=1;
		}
		var len = ((slideIndex-1)*size);
		slideShow(len);
		  
	};
	
	//-----
	//countImage
	function getCountImageList(getCountUrl, id){
		$.ajax({
			method:"GET",
			url:getCountUrl,
			data:{id:id},
			success:function(data){
				$('.pagination .num.off > span').text(data).val();
			},
		});
	};
 	getCountImageList(countUrl, id);

 	//product_detail 
 	function getProductDetail(getProductDetailUrl, id){
 		$.ajax({
 			method:"GET",
 			url:getProductDetailUrl,
			data:{id:id},
			success:function(data){
				console.log(data);
				$('.detail_info_lst').find('.in_dsc').html(data.content);
			},
 		});
 	};
	getProductDetail(productDetailUrl, id);

	//display_info
	function getDisplayInfo(getDisplayInfoUrl, id){
		$.ajax({
 			method:"GET",
 			url:getDisplayInfoUrl,
			data:{id:id},
			success:function(data){
				console.log("info");
				console.log(data);
				//상세페이지 상단 아이콘 링크 
				$('.group_btn_goto').find('.btn_goto_home').attr('href', data.homepage);
				$('.group_btn_goto').find('.btn_goto_tel').attr('href', "tel:"+data.tel);
				$('.group_btn_goto').find('.btn_goto_mail').attr('href', "mailto:"+data.email);
				//오시는길 정보
				$('.detail_location').find('p.store_addr.store_addr_bold').text(data.placeStreet);
				$('.detail_location').find('span.addr_old_detail').text(data.placeLot);
				$('.detail_location').find('p.store_addr.addr_detail').text(data.placeName);
				$('.lst_store_info_wrap').find('a.store_tel').attr('href', "tel:"+data.tel).text(data.tel);
				var hompageItem = '<div class="lst_store_info_wrap">'
							+'<ul class="lst_store_info">'
							+' <li class="item"> <span class="item_lt"> <i class="fn fn-home1"></i> '
							+'<span class="sr_only">홈페이지</span> </span> <span class="item_rt">'
							+'<a href="'+data.homepage+'" class="store_tel">'+data.homepage+'</a></span> </li>'
                            +'</ul></div>' ;
                var emailItem = '<div class="lst_store_info_wrap">'
							+'<ul class="lst_store_info">'
							+'<li class="item"> <span class="item_lt"> <i class="fn fn-mail1"></i> '
							+'<span class="sr_only">이메일</span> </span> <span class="item_rt">'
							+'<a href="'+data.email+'" class="store_tel">'+data.email+'</a></span> </li>'
                            +'</ul></div>' ;

                $('.lst_store_info_wrap').after(hompageItem).after(emailItem);                                      
			},
 		});
	};
	getDisplayInfo(displayUrl, id);


	//버튼 이벤트 처리 
	$('.group_visual').on("click ", '.nxt_inn' , function(event){
	 		event.stopPropagation();
			//console.log("nxt clicked");
			manualSlide(1);
			$('.figure_pagination span:eq(0)').text(slideIndex).val();
			if(slideIndex===1){
				$('.btn_prev').find('.spr_book2.ico_arr6_lt').addClass('off');
			}else{
				$('.btn_prev').find('.spr_book2.ico_arr6_lt').removeClass('off');
			}
	}).bind(slideIndex);

 	$('.group_visual').on("click touch", '.prev_inn' , function(event){
			event.stopPropagation();
			//console.log("prev clicked");
			manualSlide(-1);
			$('.figure_pagination span:eq(0)').text(slideIndex).val();
			if(slideIndex==1){
				$('.btn_prev').find('.spr_book2.ico_arr6_lt').addClass('off');

			}else{
				$('.btn_prev').find('.spr_book2.ico_arr6_lt').removeClass('off');
			}
	}).bind(slideIndex);
	
	//예매하기 버튼
	$('.section_btn').on("click", '.bk_btn', function(){
		var salesFlag = $('.section_btn').find('.bk_btn').data().sales;
		//판매시점 지남여부 
		console.log(salesFlag);
		var current = new Date();
		var Year = current.getFullYear();
		var Month = current.getMonth()+1;
		var Day = current.getDate();
		var salesEnd =  $('.section_btn').find('i.fn-nbooking-calender2').data().salesDate.split('-');
		if(Year<=salesEnd[0] && Month <=salesEnd[1] && Day <=salesEnd[2]){
			alert("구매가능");
		}else{
			alert("판매기간 종료");
		}
		//매진
		if(salesFlag!==0) {
			alert("매진");
		}
	});

	//상세정보 혹은 오시는길 버튼
	$('.info_tab_lst').find('._detail').on("click", '.anchor', function(){
		$('.info_tab_lst ._path').find('.anchor').removeClass('active');
		$('.info_tab_lst ._detail').find('.anchor').addClass('active');
		$('.detail_area_wrap').removeClass('hide');
		$('.detail_location').addClass('hide');
		event.preventDefault();
		event.stopPropagation();
	});

	$('.info_tab_lst').find('._path').on("click", '.anchor', function(){	
		$('.info_tab_lst ._detail').find('.anchor').removeClass('active');
		$('.info_tab_lst ._path').find('.anchor').addClass('active');
		$('.detail_area_wrap').addClass('hide');
		$('.detail_location').removeClass('hide');
		event.preventDefault();
		event.stopPropagation();
	});

	
 })();