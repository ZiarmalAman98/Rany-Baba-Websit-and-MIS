@extends('layouts.app')
@section('title', 'ولایت تغیرول')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">

            <div class="card" style="border-radius: 0px;;">
                <div class="row" style="margin-top:20px;">

                    <div class="col-lg-6" style="text-align: right;">
                        <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h5>
                    </div>
                    <div class="col-lg-6  text-left">
                        <span id="time" style="margin-left:10px;"></span>
                        <script>
                            window.setInterval(ut, 1000);

                            function ut() {
                                var d = new Date();
                                document.getElementById("time").innerHTML = d.toLocaleTimeString();
                            }
                        </script>
                    </div>

                </div>
                <div class="card card-header" style="background-color: gray;  color:white; border-radius:0px;">
                    <h5 style="text-align: center;">ولایت تغیرول</h5>
                </div>
                <div class="card-body" style="text-align:right;">

                    <form method="post" action="{{ route('province.update', $province) }}" dir="rtl"
                        style="text-align:right;">
                        @csrf
                        @method('PUT')
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group-sm ">
                                    <label for="name">ولایت</label>
                                    <input type="text" required="required" value="{{ $province->name }}"
                                        placeholder="نوی ولایت اضافه کړئ" class="form-control" id="name" name="name"
                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right" style="margin-top: 30px;">
                                <button type="submit" class="btn btn-primary btn-md" name="submit">ثبت کول</button>
                                <a href="{{ route('province.index') }}" class="btn btn-danger">واپس تلل</a>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
@endsection
