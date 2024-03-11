<?php
$options_model = array(
	'gpt-3.5-turbo-16k'      => esc_html__( 'GPT 3.5 Turbo 16k', 'aibuddy-openai-chatgpt' ),
	'gpt-3.5-turbo'          => esc_html__( 'GPT 3.5 Turbo', 'aibuddy-openai-chatgpt' ),
	'gpt-3.5-turbo-instruct' => esc_html__( 'GPT 3.5 Turbo Instruct', 'aibuddy-openai-chatgpt' ),
	'gpt-4'                  => esc_html__( 'GPT 4', 'aibuddy-openai-chatgpt' ),
	'gemini-pro'             => esc_html__( 'Gemini 1.0 Pro', 'aibuddy-openai-chatgpt' ),
);
?>
<div class="ai-buddy-modal-window model-params-popup">
	<div class="ai-buddy-modal-window-wrapper">
		<div class="modal-header">
			<div class="section-title"><?php echo esc_html__( 'Model options', 'aibuddy-openai-chatgpt' ); ?></div>
			<div class="modal-close"><span class="aibuddy-close"></span></div>
		</div>
		<div class="modal-body">
			<div class="ai-buddy-container">
				<div class="section">
					<div class="section-content">
						<div class="section-field">
							<label class="section-subtitle">
								<span><?php echo esc_html__( 'Model:', 'aibuddy-openai-chatgpt' ); ?></span>
								<select name="model-select" id="language-model-select"  class="ai-buddy-select">
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
							</label>
						</div>
						<div class="section-field-information" style="margin-top: -10px;">
							<span class="aibuddy-information"></span> <?php echo esc_html__( 'At present, the Davinci model is the sole suitable model for generating written content. However, once more advanced models become accessible, you will have the option to select from among them.', 'aibuddy-openai-chatgpt' ); ?>
						</div>
					</div>
				</div>
				<div class="section">
					<div class="section-content">
						<div class="section-field">
							<label class="section-subtitle">
								<span><?php echo esc_html__( 'Temperature:', 'aibuddy-openai-chatgpt' ); ?></span>
								<input type="number" placeholder="0.6" id="model-temperature" value="0.6" min="0.1" max="1" step="0.1" />
							</label>
						</div>
						<div class="section-field-information" style="margin-top: -10px;">
							<span class="aibuddy-information"></span> <?php echo esc_html__( 'The range is from 0.1 to 1, where a larger value indicates that the model will be more inclined to take risks.', 'aibuddy-openai-chatgpt' ); ?>
						</div>
					</div>
				</div>
				<div class="section">
					<div class="section-content">
						<div class="section-field">
							<label class="section-subtitle">
								<span><?php echo esc_html__( 'Maximum number of Tokens:', 'aibuddy-openai-chatgpt' ); ?></span>
								<input type="number" value="2048" min="16" max="16000" class="model-max-tokens" />
							</label>
						</div>
						<div class="section-field-information" style="margin-top: -10px;">
							<span class="aibuddy-information"></span> <?php echo esc_html__( 'The range for the values is from 16 to 2048. If the value is higher, the model will produce a greater amount of content.', 'aibuddy-openai-chatgpt' ); ?>
						</div>
					</div>
				</div>
				<div class="section">
					<div class="section-content">
						<div class="section-button-box section-button-box-full">
							<button type="button" class="ai-buddy-button gray button-model-params-close"><?php echo esc_html__( 'Cancel', 'aibuddy-openai-chatgpt' ); ?></button>
							<button class="ai-buddy-button right-alignment button-model-params-close"><?php echo esc_html__( 'Apply', 'aibuddy-openai-chatgpt' ); ?></button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="ai-buddy-modal-window-overlay"></div>
</div>
