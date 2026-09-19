<?php
namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentController extends Controller {
    public function index($user_id) {
        return response()->json(PaymentMethod::where('user_id', $user_id)->get());
    }

    public function store(Request $request) {
        $pm = PaymentMethod::create($request->all());
        return response()->json($pm, 201);
    }

    public function destroy($id) {
        PaymentMethod::destroy($id);
        return response()->json(['message' => 'Metode pembayaran dihapus']);
    }
}