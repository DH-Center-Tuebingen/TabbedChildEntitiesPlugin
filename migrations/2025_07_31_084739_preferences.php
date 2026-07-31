<?php

namespace App\Plugins\TabbedChildEntities\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function migrate(): void {
        DB::table('preferences')->insert([
            [
                'label' => 'plugin.tabbed_child_entities.preference.title',
                'default_value' => '{"title": "entity_name"}',
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function rollback(): void {
        DB::table('preferences')->where('label', 'plugin.tabbed_child_entities.preference.title');
    }
};
