<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tabbed_child_entities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('entity_type_id')->unsigned();
            
            $table->foreign('entity_type_id')
                ->references('id')
                ->on('entity_types')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tabbed_child_entities');
    }
};
