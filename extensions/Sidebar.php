<?php
###########让左侧栏中Wiki工具可以通过Sidebar自定义##############
$wgHooks['BaseTemplateToolbox'][] = 'modifyToolbox';

function modifyToolbox( BaseTemplate $baseTemplate, array &$toolbox ) {

	static $keywords = array( 'WHATLINKSHERE', 'RECENTCHANGESLINKED', 'FEEDS', 'CONTRIBUTIONS', 'LOG', 'BLOCKIP', 'EMAILUSER', 'USERRIGHTS', 'UPLOAD', 'SPECIALPAGES', 'PRINT', 'PERMALINK', 'INFO' );

	$modifiedToolbox = array();

	// Walk in the MediaWiki:Sidebar message, section toolbox
	foreach ( $baseTemplate->data['sidebar']['TOOLBOX'] as $value ) {
		$specialLink = false;

		// Search if the keyword exists
		foreach ( $keywords as $key ) {
			if ( $value['href'] == Title::newFromText($key)->fixSpecialName()->getLinkURL() ) {
				$specialLink = true;

				// This is a keyword, hence add this special link
				if ( array_key_exists( strtolower($key), $toolbox ) ) {
					$modifiedToolbox[strtolower($key)] = $toolbox[strtolower($key)];
					break;
				}
			}
		}

		// This is a normal link
		if ( !$specialLink ) {
			$modifiedToolbox[] = $value;
		}
	}

	$toolbox = $modifiedToolbox;

	return true;
}

######################################################
