<?php
namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller {
    public function index($user_id) {
        return response()->json(Address::where('user_id', $user_id)->get());
    }

    public function store(Request $request) {
        $address = Address::create($request->all());
        return response()->json($address, 201);
    }

    public function destroy($id) {
        Address::destroy($id);
        return response()->json(['message' => 'Alamat dihapus']);
    }
}