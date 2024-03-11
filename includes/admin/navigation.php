<div class="ai-buddy-navigation">
	<div class="ai-buddy-navigation-logo">
		<div class="ai-buddy-navigation-logo-image">
			<img src="<?php 
echo  esc_url( AI_BUDDY_FILES_PATH . 'assets/images/ai-buddy.png' ) ;
?>" width="40" height="40" alt="AiBud WP Plugin with Artificial Intelligence for WordPress" />
		</div>
		<div class="ai-buddy-navigation-logo-text">
			AiBud WP Plugin
			<div class="plugin-version">
				<?php 
echo  esc_html__( 'Version: ', 'aibuddy-openai-chatgpt' ) ;
echo  esc_attr( AI_BUDDY_VERSION ) ;
?>
			</div>
		</div>
	</div>
	<div class="ai-buddy-navigation-list">
		<div class="ai-buddy-navigation-list-item <?php 
echo  ( 'ai_buddy_content_builder' === $_GET['page'] ? 'active' : '' ) ;
?>"><a href="<?php 
echo  esc_url_raw( admin_url( 'admin.php?page=ai_buddy_content_builder' ) ) ;
//phpcs:ignore
?>" rel="nofollow"><span class="aibuddy-edit"></span> <?php 
echo  esc_html__( 'Content builder', 'aibuddy-openai-chatgpt' ) ;
?></a></div>
		<div class="ai-buddy-navigation-list-item <?php 
echo  ( 'ai_buddy_image_generator' === $_GET['page'] ? 'active' : '' ) ;
?>"><a href="<?php 
echo  esc_url_raw( admin_url( 'admin.php?page=ai_buddy_image_generator' ) ) ;
//phpcs:ignore
?>" rel="nofollow"><span class="aibuddy-image"></span> <?php 
echo  esc_html__( 'Image generator', 'aibuddy-openai-chatgpt' ) ;
?></a></div>
		<div class="ai-buddy-navigation-list-item <?php 
echo  ( 'ai_buddy_playground' === $_GET['page'] ? 'active' : '' ) ;
?>"><a href="<?php 
echo  esc_url_raw( admin_url( 'admin.php?page=ai_buddy_playground' ) ) ;
//phpcs:ignore
?>" rel="nofollow"><span class="aibuddy-cubes"></span> <?php 
echo  esc_html__( 'Playground', 'aibuddy-openai-chatgpt' ) ;
?></a></div>
		<?php 
?>
            <div class="ai-buddy-navigation-list-item <?php 
echo  ( 'ai_buddy_chatbot' === $_GET['page'] ? 'active' : '' ) ;
//phpcs:ignore
?>"><a href="<?php 
echo  esc_url_raw( admin_url( 'admin.php?page=ai_buddy_content_builder-pricing' ) ) ;
//phpcs:ignore
?>" rel="nofollow"><span class="aibuddy-chat"></span> <?php 
echo  esc_html__( 'Chatbot', 'aibuddy-openai-chatgpt' ) ;
?><var><?php 
echo  esc_html__( 'PRO', 'aibuddy-openai-chatgpt' ) ;
?></var></a></div>
		<?php 
?>
		<div class="ai-buddy-navigation-list-item <?php 
echo  ( 'ai_buddy_settings' === $_GET['page'] ? 'active' : '' ) ;
?>"><a href="<?php 
echo  esc_url_raw( admin_url( 'admin.php?page=ai_buddy_settings' ) ) ;
//phpcs:ignore
?>" rel="nofollow"><span class="aibuddy-settings"></span> <?php 
echo  esc_html__( 'Settings', 'aibuddy-openai-chatgpt' ) ;
?></a></div>
	</div>
	<div class="ai-buddy-navigation-additions">
		<a href="#" rel="nofollow" class="notifications-status"><span class="aibuddy-info"></span> <?php 
echo  esc_html__( 'Open AI status', 'aibuddy-openai-chatgpt' ) ;
?></a>
		<div class="ai-status">
			<div class="ai-status-content-wrapper">
				<h3><?php 
echo  esc_html__( 'Open AI status', 'aibuddy-openai-chatgpt' ) ;
?></h3>
				<div class="ai-status-content-inside"></div>
			</div>
		</div>
		<a href="#" rel="nofollow" class="additions-menu"><span class="aibuddy-bullets"></span><span class="aibuddy-close-big"></span></a>
		<div class="support-menu">
			<ul>
				<li><a href="https://docs.aibudwp.com/" target="_blank" rel="nofollow"><span class="aibuddy-documentation"></span> <?php 
echo  esc_html__( 'Documentation', 'aibuddy-openai-chatgpt' ) ;
?></a></li>
				<li><a href="https://aibudwp.com/contact-us/" target="_blank" rel="nofollow"><span class="aibuddy-support"></span> <?php 
echo  esc_html__( 'Support', 'aibuddy-openai-chatgpt' ) ;
?></a></li>
				<?php 

if ( !get_option( 'ai_buddy_feedback_added', false ) ) {
    ?>
					<li class="ai-buddy-feedback-button"><a href="#"><span class="aibuddy-feedback"></span> <?php 
    echo  esc_html__( 'Feedback', 'aibuddy-openai-chatgpt' ) ;
    ?></a></li>
				<?php 
}

?>
			</ul>
		</div>
	</div>
</div>
<?php 
require AI_BUDDY_PATH . '/includes/admin/api-key-alert.php';
require AI_BUDDY_PATH . '/includes/admin/feedback.php';