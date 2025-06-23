<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\TeamsController;
use App\Http\Controllers\Api\EventsController;
use App\Http\Controllers\Api\SurveyController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HomeHeroController;
use App\Http\Controllers\Api\HomeAboutController;
use App\Http\Controllers\Api\SurveyStatsController;
use App\Http\Controllers\Api\PublicSurveyController;
use App\Http\Controllers\Api\SurveyQuestionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('journals', JournalController::class);
Route::apiResource('teams', TeamsController::class);
Route::apiResource('abouts', AboutController::class);
Route::apiResource('events', EventsController::class);
Route::apiResource('/home/hero', HomeHeroController::class);
Route::get('/home/about', [HomeAboutController::class, 'index']);
Route::post('/home/about', [HomeAboutController::class, 'store']);
Route::put('/home/about/{id}', [HomeAboutController::class, 'update']);
Route::delete('/home/about/{id}', [HomeAboutController::class, 'destroy']);
Route::get('/home/active-journals', [JournalController::class, 'activeJournals']);
Route::get('/home/featured-journals', [JournalController::class, 'featuredJournals']);
Route::put('/home/featured-journals', [JournalController::class, 'updateFeaturedJournals']);
Route::apiResource('categories', CategoryController::class);
Route::get('/events/slug/{slug}', [EventsController::class, 'showBySlug']);
Route::get('/public-events', [EventsController::class, 'publicList']);
Route::apiResource('partners', PartnerController::class);

Route::get('/survey/{slug}', [PublicSurveyController::class, 'showBySlug']);
Route::post('/survey/{slug}/submit', [PublicSurveyController::class, 'submitAnswer']);
Route::get('/surveys/{slug}/check', [PublicSurveyController::class, 'checkIfAnswered']);

Route::prefix('admin')->group(function () {
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::get('/surveys/{id}', [SurveyController::class, 'show']);
    Route::put('/surveys/{id}', [SurveyController::class, 'update']);
    Route::delete('/surveys/{id}', [SurveyController::class, 'destroy']);
    Route::get('/surveys/{id}/stats', [SurveyStatsController::class, 'index']);

    // Pertanyaan per survey
    Route::post('/surveys/{survey}/questions', [SurveyQuestionController::class, 'store']);
    Route::delete('/questions/{id}', [SurveyQuestionController::class, 'destroy']);
});
