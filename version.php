<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Version metadata for the repository_pluginname plugin.
 *
 * @package   repository_pluginname
 * @copyright 2024, author_fullname <author_link>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$plugin->version = TODO;
$plugin->requires = TODO;
$plugin->supported = TODO;   // Available as of Moodle 3.9.0 or later.
$plugin->incompatible = TODO;   // Available as of Moodle 3.9.0 or later.
$plugin->component = 'TODO_FRANKENSTYLE';
$plugin->maturity = MATURITY_STABLE;
$plugin->release = 'TODO';

$plugin->dependencies = [
	'mod_forum' => 2022042100,
	'mod_data' => 2022042100
];
