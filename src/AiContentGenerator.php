<?php

namespace AiBuddy;

use AiBuddy\OpenAi\Api;
use AiBuddy\Google\Api as GoogleAi;
use AiBuddy\OpenAi\ImageQuery;
use AiBuddy\OpenAi\Query;
use AiBuddy\OpenAi\Response;
use AiBuddy\OpenAi\TextQuery;
use AiBuddy\OpenAi\MessageQuery;
use Exception;
use InvalidArgumentException;
use RuntimeException;

class AiContentGenerator {
	private Api $api;
	
	private GoogleAi $googleAi;

	public function __construct( Api $api, GoogleAi $googleAi ) {
		$this->api = $api;
		$this->googleAi = $googleAi;
	}

	/**
	 * @return Response
	 */
	public function exec( Query $query ) {
		try {
			if ( $query instanceof TextQuery ) {
			    if ($query->model === 'gemini-pro') {
                    $data     = $this->googleAi->create_completions( $query->to_request_body() );
                    
                    $response = new Response(
                        $query,
                        ! is_string( $data ) ? [$data['candidates'][0]['content']['parts'][0]['text']] : array( $data ),
                        ! is_string( $data ) ? $data : array( $data ),
                    );
			    } else {
                    $data     = $this->api->create_completions( $query->to_request_body() );
                    $response = new Response(
                        $query,
                        ! is_string( $data ) ? [$data['choices'][0]['message']['content']] : array( $data ),
                        ! is_string( $data ) ? $data : array( $data ),
                    );
                }
			} elseif ( $query instanceof ImageQuery ) {
				$data     = $this->api->create_images( $query->to_request_body() );
				$response = new Response(
					$query,
					! is_string( $data ) ? array_column( $data['data'], 'url' ) : array( $data ),
					! is_string( $data ) ? $data : array( $data ),
				);
			} elseif ( $query instanceof MessageQuery ) {
				$data     = $this->api->create_message_completions( $query->to_request_body() );
				$response = new Response(
					$query,
					$data['choices'][0]['message'],
					$data
				);
			} else {
				throw new InvalidArgumentException( 'Unknown query type' );
			}
			UsageLogger::log( $response );
			return $response;
		} catch ( Exception $e ) {
			throw new RuntimeException( $e->getMessage() );
		}
	}
}
