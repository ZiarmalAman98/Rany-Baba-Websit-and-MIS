@extends('layouts.app')
@section('title', 'مسیر ثبت صفحه')
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
                <div class="card card-header" style="background-color: rgb(215, 128, 128);  border-radius:0px;">
                    <h5 style="text-align: center;"> نوي مسیر ثبتول </h5>
                </div>
                <div class="card-body" style="text-align:right;">

                    <form method="post" action="{{ route('directions.store') }}"dir="rtl" style="text-align:right;">
                        @csrf
                        <div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="direction_number">د مسیر کوډ</label>
                                    <input type="text" placeholder="د مسیر کوډ داخل کړئ" required="required"
                                        class="form-control" name="direction_number" required="required" />
                                    <div style="color: red;">{{ $errors->first('direction_number') }}</div>
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="from-add">مسیر څخه</label>
                                    <input type="text" class="form-control" placeholder="د مسیر څخه " required="required"
                                        name="from_add" />
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="to_add">تر مسیره</label>
                                    <input type="text" class="form-control" placeholder="تر مسیره پوري"
                                        required="required" id="to_add" name="to_add" />
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right" style="margin-top: 30px;">
                                <button type="submit" class="btn btn-primary btn-md " name="submit">ثبت کول</button>
                                <!-- <input type="submit" class="btn btn-default btn-md" value="پورتني معلومات لیري کول" name="submit" /> -->
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </form>


                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <hr style="border-bottom: 2px gray solid;" />
                    <h3 class="text-center">د ټولو مسیرونو لېست</h3>
                    <hr>
                </div>


                <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                    <style>
                        #example tr th,
                        #example tr td {
                            text-align: center;

                        }
                    </style>
                    <table id="example" class="table table-striped table-bordered text-right" width="100%"
                        cellspacing="0" dir="ltr">
                        <thead class="bg-gray">
                            <tr>
                                <th rowspan="2">عملیه</th>
                                <th rowspan="2">تر مسیره </th>
                                <th rowspan="2">د مسیر څخه </th>
                                <th rowspan="2">د مسیر کوډ</th>
                                <th rowspan="2">شماره</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($get_directions as $direction)
                                <tr>
                                    <td>
                                        <a href="{{ route('directions.edit', $direction->id) }}"
                                            class="btn btn-md btn-danger">تغیرول</a>
                                    </td>
                                    <td>{{ $direction->to_add }}</td>
                                    <td>{{ $direction->from_add }}</td>
                                    <td>{{ $direction->direction_number }}</td>
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


@section('pageJs')

    <script></script>

@endsection
