<?php
$general_setting = get_option( 'ai_buddy', array() );

if ( ! isset( $general_setting['api_key_validation'] ) ) :
	?>
<div class="ai-buddy-first-screen">
	<div class="ai-buddy-first-screen-content">
		<div class="ai-buddy-first-screen-content-image"><img src="<?php echo esc_url( AI_BUDDY_FILES_PATH . 'assets/images/ai-buddy-first-screen.png' ); ?>" width="500" height="300" alt="AiBud WP Plugin with Artificial Intelligence for WordPress" /></div>
		<div class="ai-buddy-first-screen-content-title"><?php echo esc_html__( 'Welcome to AiBud WP Plugin!', 'aibuddy-openai-chatgpt' ); ?></div>
		<div class="ai-buddy-first-screen-content-description"><?php echo esc_html__( 'AiBud WP is a powerful tool for integrating OpenAI\'s language processing capabilities to create more compelling and personalized content.', 'aibuddy-openai-chatgpt' ); ?></div>
		<form>
			<div class="ai-buddy-first-screen-content-form">
				<div class="ai-buddy-first-screen-content-form-title"><?php echo esc_html__( 'Open AI API Key', 'aibuddy-openai-chatgpt' ); ?></div>
				<div class="ai-buddy-first-screen-content-form-information">
					<span class="aibuddy-information"></span>
					<?php
					printf(
						// Translators: %1$s: Open Link for account api key, %2$s: Close Link for account api key
						esc_html__( 'You can get your API Keys in your %1$sOpenAI Account%2$s.', 'aibuddy-openai-chatgpt' ),
						'<a href="https://platform.openai.com/account/usage/" target="_blank" rel="nofollow">',
						'</a>'
					);
					?>
				</div>
				<input type="text" id="ai_buddy-api-key" name="" value="" placeholder="<?php echo esc_html__( 'Enter Open AI API key here', 'aibuddy-openai-chatgpt' ); ?>" />
				<div class="ai-buddy-api-key-validator"></div>
				<div class="ai-buddy-first-screen-content-form-buttons">
					<a href="#" class="ai-buddy-button outline button-skip-api-key"><?php echo esc_html__( 'Skip', 'aibuddy-openai-chatgpt' ); ?></a>
					<button type="button" class="ai-buddy-button button-send-api-key"><?php echo esc_html__( 'Submit API KEY', 'aibuddy-openai-chatgpt' ); ?></button>
				</div>
			</div>
		</form>
	</div>
</div>
<?php endif; ?>
