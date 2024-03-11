<?php

namespace AiBuddy;

use Parsedown;

class Markdown {

	private Parsedown $parsedown;

	public function __construct( Parsedown $parsedown ) {
		$this->parsedown = $parsedown;
	}

	public function to_html( string $text ): string {
		return $this->parsedown->text( $text );
	}
}
