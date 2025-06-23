<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Survey extends Model
{
    protected $fillable = ['title', 'description', 'start_at', 'end_at'];

    protected static function booted()
    {
        static::creating(function ($survey) {
            if (empty($survey->slug)) {
                $survey->slug = Str::slug($survey->title) . '-' . Str::random(6);
            }
        });
    }

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
