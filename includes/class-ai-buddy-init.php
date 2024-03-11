<?php

class AI_Buddy_Init {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'ai_buddy_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'ai_buddy_admin_scripts_and_styles' ) );
		add_action( 'wp_ajax_ai_buddy_ajax_add_feedback', array( $this, 'ai_buddy_ajax_add_feedback' ) );
	}
	
	/**
	 * Assigning a folder for translations
	 * Domain name text ai_buddy
	 */
	public function ai_buddy_load_text_domain() {
		load_plugin_textdomain( 'aibuddy-openai-chatgpt', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Adding a settings page to the WordPress menu
	 */
	public function ai_buddy_admin_menu() {
		add_menu_page(
			esc_html__( 'AiBud WP', 'aibuddy-openai-chatgpt' ),
			esc_html__( 'AiBud WP', 'aibuddy-openai-chatgpt' ),
			'manage_options',
			'ai_buddy_content_builder',
			array( $this, 'ai_buddy_content_builder' ),
			AI_BUDDY_FILES_PATH . 'assets/images/ai-buddy.png',
			9
		);
		add_submenu_page(
			'ai_buddy_content_builder',
			esc_html__( 'AiBud WP > Content Builder', 'aibuddy-openai-chatgpt' ),
			esc_html__( 'Content Builder', 'aibuddy-openai-chatgpt' ),
			'manage_options',
			'ai_buddy_content_builder',
			array( $this, 'ai_buddy_content_builder' )
		);
		add_submenu_page(
			'ai_buddy_content_builder',
			esc_html__( 'Image Generator', 'aibuddy-openai-chatgpt' ),
			esc_html__( 'Image Generator', 'aibuddy-openai-chatgpt' ),
			'manage_options',
			'ai_buddy_image_generator',
			array( $this, 'ai_buddy_image_generator' )
		);
		add_submenu_page(
			'ai_buddy_content_builder',
			esc_html__( 'Playground', 'aibuddy-openai-chatgpt' ),
			esc_html__( 'Playground', 'aibuddy-openai-chatgpt' ),
			'manage_options',
			'ai_buddy_playground',
			array( $this, 'ai_buddy_playground' )
		);
		add_submenu_page(
			'ai_buddy_content_builder',
			esc_html__( 'Settings', 'aibuddy-openai-chatgpt' ),
			esc_html__( 'Settings', 'aibuddy-openai-chatgpt' ),
			'manage_options',
			'ai_buddy_settings',
			array( $this, 'ai_buddy_settings' )
		);
	}

	/**
	 * Connecting files in the admin panel
	 * For Content Builder
	 */
	public function ai_buddy_content_builder() {
		require 'admin/navigation.php';
		require 'admin/page-templates/content-builder/content-builder.php';
	}

	/**
	 * Connecting files in the admin panel
	 * For Image Generator
	 */
	public function ai_buddy_image_generator() {
		require 'admin/navigation.php';
		require 'admin/page-templates/image-generator/image-generator.php';
	}

	/**
	 * Connecting files in the admin panel
	 * For Playground
	 */
	public function ai_buddy_playground() {
		require 'admin/navigation.php';
		require 'admin/page-templates/playground/playground.php';
	}

	/**
	 * Connecting files in the admin panel
	 * For Settings
	 */
	public function ai_buddy_settings() {
		require 'admin/navigation.php';
		require 'admin/page-templates/settings.php';
	}

	/**
	 * Connecting files in the admin panel
	 * For style
	 * For script
	 */
	public function ai_buddy_admin_scripts_and_styles() {
		wp_enqueue_style( 'ai_buddy_admin_styles', AI_BUDDY_FILES_PATH . 'assets/css/admin.css', array(), AI_BUDDY_VERSION );
		wp_enqueue_style( 'ai_buddy_icons', AI_BUDDY_FILES_PATH . 'assets/icons/style.css', array(), AI_BUDDY_VERSION );
		wp_enqueue_script( 'ai_buddy_navigation_scripts', AI_BUDDY_FILES_PATH . 'assets/js/navigation.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_builder_scripts', AI_BUDDY_FILES_PATH . 'assets/js/content-builder.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
        wp_enqueue_script( 'ai_buddy_bulk_builder_scripts', AI_BUDDY_FILES_PATH . 'assets/js/bulk-content-builder.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
        wp_enqueue_script( 'ai_buddy_accordion', AI_BUDDY_FILES_PATH . 'assets/js/accordion.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_create_post_scripts', AI_BUDDY_FILES_PATH . 'assets/js/create-post.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_settings_scripts', AI_BUDDY_FILES_PATH . 'assets/js/settings.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_open_ai_status_scripts', AI_BUDDY_FILES_PATH . 'assets/js/open_ai_status.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_posts_scripts', AI_BUDDY_FILES_PATH . 'assets/js/posts.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_products_scripts', AI_BUDDY_FILES_PATH . 'assets/js/products.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_popups_scripts', AI_BUDDY_FILES_PATH . 'assets/js/popups.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_image_generator_scripts', AI_BUDDY_FILES_PATH . 'assets/js/image-generator.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_image_post_generator_scripts', AI_BUDDY_FILES_PATH . 'assets/js/image-post-generator.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_playground_scripts', AI_BUDDY_FILES_PATH . 'assets/js/playground.js', array( 'jquery' ), AI_BUDDY_VERSION, true );
		wp_enqueue_script( 'ai_buddy_feedback_scripts', AI_BUDDY_FILES_PATH . 'assets/js/feedback.js', array( 'jquery' ), AI_BUDDY_VERSION, true );

		wp_localize_script(
			'ai_buddy_builder_scripts',
			'ai_buddy_content_builder',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/ai/generator/completions' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_create_post_scripts',
			'ai_buddy_create_post',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/wp/posts' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_settings_scripts',
			'ai_buddy_settings',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/settings' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_open_ai_status_scripts',
			'ai_buddy_status',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/openai/incidents' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_open_ai_status_scripts',
			'ai_buddy_files',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/openai/files' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_image_generator_scripts',
			'ai_buddy_image_generator',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/ai/generator/images' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'buttons'  => array(
					'download' => __( 'Download', 'aibuddy-openai-chatgpt' ),
					'details'  => esc_html__( 'Details', 'aibuddy-openai-chatgpt' ),
				),
			)
		);

		wp_localize_script(
			'ai_buddy_image_generator_scripts',
			'ai_buddy_create_attachment',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/wp/attachments' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_image_post_generator_scripts',
			'ai_buddy_image_post_generator',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/ai/generator/post_images' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_image_post_generator_scripts',
			'ai_buddy_image_post_attachment',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/wp/attachments' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_posts_scripts',
			'ai_buddy_generate_titles',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/ai/generator/titles' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_posts_scripts',
			'ai_buddy_generate_excerpts',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/ai/generator/excerpts' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_posts_scripts',
			'ai_buddy_generate_excerpts_update',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/wp/posts/update/excerpt' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_playground_scripts',
			'ai_buddy_playground',
			array(
				'api_url'  => rest_url( '/ai-buddy/v1/ai/generator/completions' ),
				'rest_url' => rest_url(),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);

		wp_localize_script(
			'ai_buddy_feedback_scripts',
			'ai_buddy_feedback',
			array(
				'nonce'      => wp_create_nonce( 'ai_buddy_ajax_add_feedback' ),
				'plugin_url' => AI_BUDDY_FILES_PATH,
			)
		);
	}

	public function ai_buddy_ajax_add_feedback() {
		update_option( 'ai_buddy_feedback_added', true );
	}

	public function ai_buddy_admin_notice_rate( $data ) {
		if ( is_array( $data ) ) {
			$data['title']   = 'Congratulations!';
			$data['content'] = 'You have generated your first content 🙌<br>A small request to you to take a moment to leave a <strong>5-star review</strong> to support us. Thank you so much for your help!';
		}

		return $data;
	}
}

new AI_Buddy_Init();
