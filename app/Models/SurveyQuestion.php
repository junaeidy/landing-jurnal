<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    protected $fillable = ['survey_id', 'question_text'];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
