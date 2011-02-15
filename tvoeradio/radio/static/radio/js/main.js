$(document).ready(function(){


    // Настройка каких-то общих вещей

    network.lastfm.api_key = config.lastfm_api_key;
    network.lastfm.api_secret = config.lastfm_api_secret;
    $.ajaxSetup({'cache':true});

    
    // Настройка UI    

    $(window).resize(ui.resz);
    ui.resz();

    
    // Поднимаем плеер

    $("#mp3player").jPlayer({
        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),
        'play': function(e) {
            network.lastfm.api(
                'track.updateNowPlaying',
                {
                    'track': player.playlist.get_current_track().title,
                    'artist': player.playlist.get_current_track().artist,
                    'duration': e.jPlayer.status.duration
                }
            );
        },
        'ended': function() {
            network.lastfm.api(
                'track.scrobble',
                {
                    'track[0]': player.playlist.get_current_track().title,
                    'timestamp[0]': player.playlist.get_current_track().started,
                    'artist[0]': player.playlist.get_current_track().artist
                }
            );
            player.control.next();
        }
    });
    
    
    // Логинимся в Last.fm, если были залогинены ранее
    
    network.lastfm.cookielogin();
    ui.update_topnav();
    ui.update_popup_lastfm();

    
    $('.popup__close').click(function(){
        $(this).parent('.popup').hide();
    });
    
    $('a.bbcode_artist').live('click', function() {
        var artist = $(this).attr('href');
        artist = artist.replace('http://www.last.fm/music/', '');
        artist = artist.replace('+', ' ');
        $('#popup_infoblock').show();
        ui.infoblock.show($('#popup_infoblock .popup__content'), 'artist', artist);
        return false;
    });
    $('#topnav__lastfm').live('click', function() {
        $('#popup_lastfm').show();
    });
    
    $('#popup_lastfm__auth1 .button').click(function() {
        var open_link = window.open('','_blank');
        network.lastfm.api('auth.getToken', {}, function(data){
            open_link.location='http://www.last.fm/api/auth/?api_key='+network.lastfm.api_key+'&token='+data.token;
            network.lastfm.auth_token = data.token;
            $('#popup_lastfm__auth1').hide();
            $('#popup_lastfm__auth2').show();
        }); 
    });
    
    $('#popup_lastfm__auth2 .button').click(function() {
        network.lastfm.api('auth.getSession', {'token': network.lastfm.auth_token}, function(data) {
            if (data.error) {
                $('#popup_lastfm__auth1 p').text('Вы не подтвердили доступ, придётся начать сначала.');
            } else {
                network.lastfm.login(data.session.name, data.session.key);
                ui.update_topnav();
            }
            ui.update_popup_lastfm();
        });
    });
    
    
    // События в плеере
    
    $('#station_change').click(player.control.stop);
    $('#menu_track__love').click(function(){
        network.lastfm.api(
            'track.love',
            {
                'track': player.playlist.get_current_track().title,
                'artist': player.playlist.get_current_track().artist
            }
        );
    });

});


network.vkontakte.init({apiId: config.vk_api_id});

