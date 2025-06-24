<?php

namespace App\Http\Controllers\Api;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SurveyQuestionController extends Controller
{
    public function store(Request $request, Survey $survey)
    {
        $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:radio,multiselect,text,select',
            'options' => 'nullable|array',
            'chart_type' => 'required_if:type,radio,multiselect|nullable|string|in:bar,pie,donut,line,area,radar,scatter',
        ]);

        $question = $survey->questions()->create([
            'question_text' => $request->question_text,
            'type' => $request->type,
            'options' => in_array($request->type, ['radio', 'multiselect', 'select']) ? $request->options : null,
            'chart_type' => $request->chart_type,
        ]);

        return response()->json($question, 201);
    }

    public function destroy($id)
    {
        $question = SurveyQuestion::findOrFail($id);
        $question->delete();

        return response()->json(['message' => 'Question deleted']);
    }
}
