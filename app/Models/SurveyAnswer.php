<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyAnswer extends Model
{
    protected $fillable = ['survey_id', 'answers', 'ip_address'];

    protected $casts = [
        'answers' => 'array',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
