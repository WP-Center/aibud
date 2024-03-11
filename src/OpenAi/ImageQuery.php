<?php

namespace AiBuddy\OpenAi;

final class ImageQuery extends Query {
	public string $size;

	private const ALLOWED_SIZES = array(
		'256x256',
		'512x512',
		'1024x1024',
	);

	public function __construct( $prompt, $model = Model::DALL_E, $size = '1024x1024' ) {
		$this->set_prompt( $prompt );
		$this->set_model( $model );
		$this->set_size( $size );
	}

	public function set_size( $size ) {
		if ( ! in_array( $size, self::ALLOWED_SIZES, true ) ) {
			throw new \InvalidArgumentException( 'Invalid size.' );
		}
		$this->size = $size;
	}

	public function to_request_body(): array {
		return array(
			'prompt' => $this->prompt,
			'model'  => 'dall-e-3',
			'n'      => $this->max_results,
			'size'   => $this->size,
		);
	}
}
