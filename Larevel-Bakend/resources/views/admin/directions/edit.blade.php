@extends('layouts.app')
@section('title', 'د مسیر تغیر پاڼه')
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
                    <h5 style="text-align: center;"> مسیر تغیرات </h5>
                </div>
                <div class="card-body" style="text-align:right;">

                    <form method="post" action="{{ route('directions.update', $direction) }}" dir="rtl"
                        style="text-align:right;">
                        @csrf
                        @method('PUT')
                        <div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="direction_number">د مسیر کوډ</label>
                                    <input type="text" placeholder="د مسیر کوډ داخل کړئ" required="required"
                                        value="{{ $direction->direction_number }}" class="form-control"
                                        name="direction_number" required="required" />
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="from-add">مسیر څخه</label>
                                    <input type="text" class="form-control" value="{{ $direction->from_add }}"
                                        required="required" placeholder="د مسیر څخه " name="from_add" />
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="to_add">تر مسیره</label>
                                    <input type="text" class="form-control" required="required"
                                        value="{{ $direction->to_add }}" placeholder="تر مسیره پوري" id="to_add"
                                        name="to_add" />
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right" style="margin-top: 30px;">
                                <button type="submit" class="btn btn-primary btn-md " name="submit">تغیرات راوستل
                                    کول</button>
                                <a href="{{ route('directions.index') }}" class="btn btn-success btn-md">واپس تلل</a>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>


@endsection


@section('pageJs')

    <script></script>

@endsection
