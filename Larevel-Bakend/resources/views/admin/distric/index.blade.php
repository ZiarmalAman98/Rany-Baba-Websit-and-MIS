@extends('layouts.app')
@section('title', 'ولسوالي ')
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
                <div class="card card-header" style="background-color: rgb(227, 148, 148); border-radius:0px;">
                    <h5 style="text-align: center;"> نوي ولسوالي ثبتول </h5>
                </div>
                <div class="card-body" style="text-align:right;">

                    <form method="post" action="{{ route('district.store') }}" dir="rtl" style="text-align:right;">
                        @csrf
                        <div class="row">
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">


                                <div class="form-group form-group-sm">
                                    <label for="pro2">ولایت</label>
                                    <select class="form-control" required="required" id="province_id" name="province_id" />
                                    <option class="text-right" value="0">ولایت انتخاب کړئ</option>
                                    @foreach ($provinces as $province)
                                        <option value="{{ $province->id }}">{{ $province->name }}</option>
                                    @endforeach
                                    </select>
                                </div>

                            </div>

                            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group-sm ">
                                    <label for="name">ولسوالي </label>
                                    <input type="text" required="required" placeholder="نوی ولسوالي اضافه کړئ"
                                        class="form-control" id="name" name="name" />

                                </div>
                            </div>


                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right d-flex" style="margin-top: 30px;">
                                <button type="submit" class="btn btn-primary btn-md " name="submit">ثبت کول</button>
                                &nbsp;
                                <input type="submit" class="btn btn-danger btn-md" value="پورتني معلومات لیري کول"
                                    name="submit" />
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </form>


                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <hr style="border-bottom: 2px gray solid;" />
                    <h3 class="text-center">د ټولو ولایتونو لېست</h3>
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
                                <th>عملیه</th>
                                <th>ولسوالي</th>
                                <th>ولایت نوم</th>
                                <th>شماره</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($districts as $district)
                                <tr>
                                    <td>
                                        <a href="{{ route('district.edit', $district) }}"
                                            class="btn btn-md btn-danger">تغیرول</a>
                                    </td>
                                    <td>{{ $district->name }}</td>
                                    <td>{{ $district->province->name }}</td>
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
