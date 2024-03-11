<?php
$options_model = array(
    'gpt-3.5-turbo-16k'      => esc_html__( 'GPT 3.5 Turbo 16k', 'aibuddy-openai-chatgpt' ),
    'gpt-3.5-turbo'          => esc_html__( 'GPT 3.5 Turbo', 'aibuddy-openai-chatgpt' ),
    'gpt-3.5-turbo-instruct' => esc_html__( 'GPT 3.5 Turbo Instruct', 'aibuddy-openai-chatgpt' ),
    'gpt-4'                  => esc_html__( 'GPT 4', 'aibuddy-openai-chatgpt' ),
    'gemini-pro'             => esc_html__( 'Gemini 1.0 Pro', 'aibuddy-openai-chatgpt' ),
);
?>

<div class="section">
	<div class="section-title"><?php echo esc_html__( 'Model options', 'aibuddy-openai-chatgpt' ); ?></div>
	<div class="section-content">
		<div class="section-field inputs-section">
			<div class="playground-setting-wrapper">
                <span class="section-subtitle"><span><?php echo esc_html__( 'Model:', 'aibuddy-openai-chatgpt' ); ?></span></span>
                <select name="model-select" id="playground-model" class="ai-buddy-select">
                    <?php
                    foreach ( $options_model as $model => $text ) {
                        $general_setting = get_option( 'ai_buddy', array() );
                        $isGeminiExist = isset( $general_setting['googleai']['apikey'] ) ? true : false;
                        if($model === 'gemini-pro'): ?>
                            <option value="<?php echo esc_attr( $model ); ?>" <?php echo $isGeminiExist ? '' : 'disabled' ?>><?php echo esc_attr( $text ); ?><?php echo ($isGeminiExist ? '' : __(' (API Key not entered)', 'aibuddy-openai-chatgpt')); ?></option>
                        <?php else: ?>
                            <option value="<?php echo esc_attr( $model ); ?>"><?php echo esc_attr( $text ); ?></option>
                        <?php endif; ?>
                    <?php } ?>
                </select>
			</div>
			<div class="playground-setting-wrapper">
				<span class="section-subtitle"><span><?php echo esc_html__( 'Temperature:', 'aibuddy-openai-chatgpt' ); ?></span></span>
				<input type="number" name="playground-temperature" id="playground-temperature" value="0.6" min="0.1" max="1" step="0.1">
			</div>
			<div class="section-field-information">
				<span class="aibuddy-information"></span> <?php echo esc_html__( 'Between 0.1 and 1. Higher values means the model will take more risks.', 'aibuddy-openai-chatgpt' ); ?>
			</div>
			<div class="playground-setting-wrapper">
				<span class="section-subtitle"><span><?php echo esc_html__( 'Max Tokens:', 'aibuddy-openai-chatgpt' ); ?></span></span>
				<input type="number" name="playground-max-tokens" id="playground-max-tokens" value="2048" min="16" max="2048">
			</div>
			<div class="section-field-information">
				<span class="aibuddy-information"></span> <?php echo esc_html__( 'Between 16 and 2048. Higher values means the model will generate more content.', 'aibuddy-openai-chatgpt' ); ?>
			</div>
		</div>
	</div>
</div>
