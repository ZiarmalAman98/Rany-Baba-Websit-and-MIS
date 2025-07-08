@extends('layouts.app')
@section('title', 'ولسوالي ')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">
            <div class="card" style="border-radius: 0px;;">
                <h3 class="text-center mt-2">د اړونده اسنادو اضافه کول</h3>
                <hr />
                <div class="card-body" style="text-align:right;">
                    <form method="post" action="{{ url('document/index') }}" enctype="multipart/form-data" dir="rtl"
                        style="text-align:right;">
                        @csrf
                        <div class="row">
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <div class="form-group-sm ">
                                        <label for="document_name">د اسنادو نوم</label>
                                        <input type="text" required="required" placeholder="د اسنادو نوم داخل کړئ"
                                            class="form-control" id="document_name" name="document_name"
                                            pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                            title="یوازې الفبا توري داخل کړئ" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group-sm ">
                                    <label for="file">اسناد اپلوډ کړئ</label>
                                    <input type="file" required="required" class="form-control" id="file"
                                        name="file"
                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />

                                    <div style="color:red;">{{ $errors->first('file') }}</div>

                                </div>
                            </div>

                            <div>
                                <div class="form-group-sm ">
                                    <input type="hidden" value="{{ $get_car->id }}" name="car_id" id="car_id"
                                        required="required" />
                                </div>
                            </div>


                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right" style="margin-top: 30px;">
                                <button type="submit" class="btn btn-primary btn-md " name="submit">ثبت کول</button>
                                <a href="{{ route('car.index') }}" class="btn btn-danger btn-md">واپس</a>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <hr style="border-bottom: 2px rgb(167, 53, 21) solid;" />
                    <h3 class="text-center">د ټولو اسنادو لېست</h3>
                    <hr>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                    <style>
                        #example tr th,
                        #example tr td {
                            text-align: center;
                        }
                    </style>
                    <table class="table table-striped table-bordered text-center" width="100%" cellspacing="0"
                        dir="ltr">
                        <thead class="bg-black">
                            <tr>
                                <th>عملیه</th>
                                <th>اړونده اسناد</th>
                                <th>نوم</th>
                                <th>شماره</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($documents as $document)
                                <tr>
                                    <td><a href="{{ url('document/delete/' . $document->id) }}"><i class="fa fa-trash"
                                                style="color:red;"></i></a></td>
                                    <td><a href="{{ asset('upload/car/file/' . $document->file) }}"><i
                                                class="fa fa-print"></i></a></td>
                                    <td>{{ $document->document_name }}</td>
                                    <td>{{ $loop->iteration }}</td>
                                </tr>
                            @endforeach

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
@endsection
