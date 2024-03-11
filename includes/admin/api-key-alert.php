<?php
$general_setting = get_option( 'ai_buddy', array() );
if ( isset( $general_setting['api_key_validation'] ) ) {
	$validator = ( 'invalid' === $general_setting['api_key_validation'] ) ? 'invalid' : 'valid';
} else {
	$validator = 'invalid';
}
?>
<div class="api-key-settings <?php echo esc_attr( $validator ); ?>">
	<div class="api-key-settings-icon">
		<img src="<?php echo esc_url( AI_BUDDY_FILES_PATH . 'assets/images/alert.svg' ); ?>" width="18" height="18" alt="AiBud WP Plugin get API Key" />
	</div>
	<div class="api-key-settings-content">
		<span><?php echo esc_html__( 'Please enter your OpenAI API key!', 'aibuddy-openai-chatgpt' ); ?></span>
		<span class="api-key-validation">
			<?php
			printf(
			// Translators: %1$s: Open Link for account api key, %2$s: Close Link for account api key
				esc_html__( 'You can get your API Keys in your %1$sOpenAI Account%2$s.', 'aibuddy-openai-chatgpt' ),
				'<a href="https://platform.openai.com/account/usage/" target="_blank" rel="nofollow">',
				'</a>'
			);
			?>
		</span>
	</div>
	<div class="api-key-settings-button">
		<a href="<?php echo esc_url_raw( admin_url( 'admin.php?page=ai_buddy_settings' ) );//phpcs:ignore ?>" class="ai-buddy-button"><?php echo esc_html__( 'Go to settings', 'aibuddy-openai-chatgpt' ); ?></a>
	</div>
</div>
