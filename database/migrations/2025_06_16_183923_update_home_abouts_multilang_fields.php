<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_abouts', function (Blueprint $table) {
            $table->json('title')->nullable()->change();
            $table->json('content')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('home_abouts', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
            $table->text('content')->nullable()->change();
        });
    }
};
