<?php

/** @var \AiBuddy\Plugin $ai_buddy_plugin */
use  AiBuddy\Chatbot ;
use  AiBuddy\Rest ;
use  AiBuddy\OpenAi ;
add_action( 'activate_' . $ai_buddy_plugin->basename, function () use( $ai_buddy_plugin ) {
    $options = (require "{$ai_buddy_plugin->root_dir}/includes/options.php");
    if ( empty(get_option( 'ai_buddy', '' )) ) {
        $ai_buddy_plugin->update_options( $options );
    }
} );
add_action( 'plugins_loaded', array( $ai_buddy_plugin, 'init' ), 11 );
add_filter(
    'plugin_action_links_' . $ai_buddy_plugin->basename,
    function ( $links, $file, $plugin_info ) use( $ai_buddy_plugin ) {
    return \AiBuddy\Admin::plugin_actions( $links, $plugin_info, $ai_buddy_plugin->slug );
},
    10,
    3
);
add_action( 'add_meta_boxes', function () use( $ai_buddy_plugin ) {
    \AiBuddy\Assistants::add_meta_boxes( $ai_buddy_plugin );
} );
add_action( 'activated_plugin', function ( $plugin ) use( $ai_buddy_plugin ) {
    
    if ( $plugin === $ai_buddy_plugin->basename ) {
        $settings_page_url = admin_url( 'admin.php?page=ai_buddy_content_builder' );
        wp_safe_redirect( $settings_page_url );
        exit;
    }

} );
add_filter( 'admin_body_class', function ( $classes ) {
    $screen = get_current_screen();
    
    if ( 'toplevel_page_ai_buddy_content_builder' === $screen->id ) {
        $general_setting = get_option( 'ai_buddy', array() );
        if ( !isset( $general_setting['api_key_validation'] ) ) {
            $classes .= ' ai-buddy-api-screen';
        }
    }
    
    return $classes;
} );
add_action( 'rest_api_init', function () use( $ai_buddy_plugin ) {
    $options = $ai_buddy_plugin->options;
    
    if ( current_user_can( 'administrator' ) ) {
        $ai_buddy_plugin->get( Rest::class )->register_rest_routes( AiBuddy\Plugin::REST_NAMESPACE );
        $ai_buddy_plugin->get( OpenAi\Rest::class )->register_rest_routes( AiBuddy\Plugin::REST_NAMESPACE );
    }
    
    if ( $options->get( 'modules.chatbot', false ) && class_exists( Chatbot\Rest::class ) ) {
        $ai_buddy_plugin->get( Chatbot\Rest::class )->register_rest_routes( AiBuddy\Plugin::REST_NAMESPACE );
    }
} );