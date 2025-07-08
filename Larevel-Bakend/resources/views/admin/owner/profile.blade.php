@extends('layouts.app')
@section('title', 'مالک پاڼه')
@section('content')
    <br>

    <style>
        body {
            margin: 0px;
            padding: 0px;
            background-color: #fafafa;

        }

        * {
            box-sizing: border-box;
            -moz-border-sizing: border-box;
        }

        .page {
            width: 21cm;
            min-height: 29.7cm;
            padding: 2cm;
            margin: 1cm auto;
            border: 1px #d3d3d3 solid;
            border-radius: 5px;
            background: white;
            box-shadow: 0 0 5px rgb(0, 0, 0, 0.1);

        }

        .subpage {
            padding: 1cm;
            border: 2px solid;
            height: 256mm;
            /* outline: 2cm #FFEAEA solid; */

        }

        @page {
            size: 8.5in 11in;
            margin: 0.25in;
        }

        @media print {
            .page {
                margin: 0;
                border: initial;
                border-radius: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
            }
        }
    </style>

    <!-- Main content -->
    <section class="content" style="font-family:sans-serif;">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">

                    <!-- Profile Image -->
                    <div class="card card-primary card-outline">
                        <div class="card-body box-profile">
                            <div class="text-center">
                                <img class="profile-user-img img-fluid img-circle"
                                    src="{{ asset('upload/owner/image/' . $get_profiles->image) }}" alt="User profile picture">
                            </div>

                            <h5 class="profile-username text-center">{{ $get_profiles->name }}</h5>

                            <p class="text-muted text-center">{{ $get_profiles->last_name }}</p>

                            <ul class="list-group list-group-unbordered mb-3">
                                <li class="list-group-item">
                                    <b>{{ $get_profiles->father_name }}</b> <a class="float-right">د پلارنوم :</a>
                                </li>
                                <li class="list-group-item">
                                    <b>{{ $get_profiles->grand_fname }}</b> <a class="float-right">نیکه نوم :</a>
                                </li>
                                <li class="list-group-item">
                                    <b>{{ $get_profiles->phone_number }}</b> <a class="float-right">موبایل شمیره : </a>
                                </li>
                                <li class="list-group-item">
                                    <b>{{ $get_profiles->per_provine_name . '-' . $get_profiles->per_dist_name . '-' . $get_profiles->permenant_village }}</b>
                                    <a class="float-right">دایمي ادرس : </a>
                                </li>
                                <li class="list-group-item">
                                    <b>{{ $get_profiles->current_pro_name . '-' . $get_profiles->current_dist_name . '-' . $get_profiles->current_village }}</b>
                                    <a class="float-right">فعلي ادرس : </a>
                                </li>
                            </ul>
                        </div>
                        <!-- /.card-body -->
                    </div>
                    <!-- /.card -->

                </div>
                <!-- /.col -->
                <div class="col-md-9">
                    <div class="card">
                        <div class="card-header p-2">
                            <ul class="nav nav-pills">
                                <li class="nav-item"><a class="nav-link active" href="#activity" data-toggle="tab">موټر
                                        معلومات</a></li>
                                <li class="nav-item"><a class="nav-link" href="#timeline" data-toggle="tab">ضامنین</a></li>
                                <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">تغیرات</a></li>
                            </ul>
                        </div><!-- /.card-header -->
                        <div class="card-body">
                            <div class="tab-content">
                                <div class="active tab-pane" id="activity" style="font-size: 11px;">
                                    <div class="row">
                                        <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                                            <style>
                                                #example tr th,
                                                #example tr td {
                                                    text-align: center;
                                                }
                                            </style>
                                            <table id="example" class="table table-striped table-bordered text-right"
                                                width="100%" cellspacing="0" dir="ltr">
                                                <thead class="bg-gray">
                                                    <tr>
                                                        <th>خرڅلاو نېټه</th>
                                                        <th>د جوړیدو نېټه</th>
                                                        <th> نوی مسیر</th>
                                                        <th> پخوانی مسیر </th>
                                                        <th> ملک تولید</th>
                                                        <th>سون موادو ډول</th>

                                                        <th>رنګ</th>
                                                        <th>شاسي نمبر</th>
                                                        <th>انجن نمبر</th>
                                                        <th>پلیټ نمبر</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @foreach ($get_cars as $car)
                                                        <tr>
                                                            <td>{{ $car->sale_date }}</td>
                                                            <td>{{ $car->create_date }}</td>
                                                            <td>{{ $car->old_address }}</td>
                                                            <td>{{ $car->changed_address }}</td>
                                                            <td>{{ $car->create_county }}</td>
                                                            <td>{{ $car->oil_type }}</td>

                                                            <td>{{ $car->car_color }}</td>
                                                            <td>{{ $car->shase_no }}</td>
                                                            <td>{{ $car->Engine_no }}</td>
                                                            <td>{{ $car->plate_no }}</td>
                                                        </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <!-- /.tab-pane -->
                                <div class="tab-pane" id="timeline">
                                    <div class="row" style="font-size: 11px;">
                                        <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                                            <style>
                                                #example tr th,
                                                #example tr td {
                                                    text-align: center;
                                                }
                                            </style>
                                            <table id="example" class="table table-striped table-bordered text-right"
                                                width="100%" cellspacing="0" dir="ltr">
                                                <thead class="bg-gray">
                                                    <tr>
                                                        <th colspan="3" class="text-center">فعلي سکونت</th>
                                                        <th colspan="3" class="text-center">اصلی سکونت</th>
                                                        <th rowspan="2"> ضامن عکس</th>
                                                        <th rowspan="2"> تلیفون نمبر</th>
                                                        <th rowspan="2"> پلار نوم </th>
                                                        <th rowspan="2"> ضامن نوم </th>
                                                        <th rowspan="2">شماره</th>
                                                    </tr>
                                                    <tr>

                                                        <th>کلی</th>
                                                        <th>ولسوالی</th>
                                                        <th>ولایت</th>
                                                        <th>کلی</th>
                                                        <th>ولسوالی</th>
                                                        <th>ولایت</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    @foreach ($get_sponsers as $sponser)
                                                        <tr>
                                                            <td>{{ $sponser->cur_village }}</td>
                                                            <td>{{ $sponser->current_dist_name }}</td>
                                                            <td>{{ $sponser->current_pro_name }}</td>
                                                            <td>{{ $sponser->per_village }}</td>
                                                            <td>{{ $sponser->per_dist_name }}</td>
                                                            <td>{{ $sponser->per_provine_name }}</td>
                                                            <td> <img src="{{ asset('upload/sponsor/' . $sponser->image) }}"
                                                                    class="img img-responsive " height="50"
                                                                    width="50"></td>
                                                            <td>{{ $sponser->phone_number }}</td>
                                                            <td>{{ $sponser->sponsor_fname }}</td>
                                                            <td>{{ $sponser->sponser_name }}</td>
                                                            <td>{{ $loop->iteration }}</td>
                                                        </tr>
                                                    @endforeach

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>



                                </div>
                                <!-- /.tab-pane -->

                                <div class="tab-pane" id="settings">
                                    <form method="post" action="{{ route('owner.update', $edit_owner) }}"
                                        enctype="multipart/form-data" dir="rtl">
                                        @csrf
                                        @method('PUT')
                                        <div class="row">
                                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                                <h5 class="text-center">د مالک شهرت</h5>
                                                <div class="form-group form-group-sm">
                                                    <label for="owner_code" style="align-content: center;">د مالک خاص نمبر
                                                        چې هر يو یی باید په یاد ولري</label>
                                                    <input type="text" readonly="readonly" class="form-control"
                                                        id="owner_code" value="{{ $edit_owner->id }}" name="student_code"
                                                        required="required" />
                                                </div>
                                                <div class="row">
                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="name">نوم<span style="color: red"> * </span></label>
                                                        <input type="text" placeholder="د  مالک  نوم"
                                                            class="form-control text-right"
                                                            value="{{ $edit_owner->name }}" id="name"
                                                            name="name" required="required"
                                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                                    </div>
                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="last_name">تخلص<span style="color: red"> *
                                                            </span></label>
                                                        <input type="text" placeholder="د مالک  تخلص نوم"
                                                            class="form-control text-right"
                                                            value="{{ $edit_owner->last_name }}" id="last_name"
                                                            name="last_name" required="required"
                                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                                    </div>
                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="father_name">د پلار نوم<span style="color: red"> *
                                                            </span></label>
                                                        <input type="text" placeholder=" د پلار  نوم"
                                                            class="form-control" id="father_name"
                                                            value="{{ $edit_owner->father_name }}" name="father_name"
                                                            required="required"
                                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                                            title="یوازې پښتوالفبا توري داخل کړئ" />
                                                    </div>
                                                    <div
                                                        class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="grand_fname">د نیکه نوم<span style="color: red"> *
                                                            </span></label>
                                                        <input type="text" placeholder=" د نیکه  نوم"
                                                            class="form-control" id="grand_father"
                                                            value="{{ $edit_owner->grand_fname }}" required="required"
                                                            name='grand_fname'
                                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسښشصضطظعغفقکګلمنڼږهءیي۰ېئۍ\s]*"
                                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                                    </div>


                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="owner_job">د مالک دنده</label>
                                                        <input type="text" value="{{ $edit_owner->owner_job }}"
                                                            placeholder="مالک دنده" class="form-control" id="owner_job"
                                                            name="owner_job" required="required"
                                                            pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                                            title="یوازې الفبا توري داخل کړئ" />
                                                    </div>

                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="job_place">د مالک دندي ځای</label>
                                                        <input type="text" placeholder="دندي ځای"
                                                            value="{{ $edit_owner->job_place }}" class="form-control"
                                                            id="job_place" name="job_place"
                                                            pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                                            title="یوازې الفبا توري داخل کړئ" />
                                                    </div>

                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="nic_number">د تذکیرې نمبر<span style="color: red"> *
                                                            </span></label>
                                                        <input type="text" value="{{ $edit_owner->nic_number }}"
                                                            placeholder="تزکري نمبر" name="nic_number"
                                                            class="form-control" onkeypress="return isNumber()"
                                                            id="nic_number" required="required" pattern="[۰-۹]*[0-9]*"
                                                            title="یوازې نمبر داخل کړئ" />
                                                        <div style="color:red;">{{ $errors->first('nic_number') }}</div>
                                                    </div>

                                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                                        <label for="phone_number">د موبایل نمبر<span style="color: red"> *
                                                            </span></label>
                                                        <input type="text" value="{{ $edit_owner->phone_number }}"
                                                            placeholder="موبایل نمبر" name="phone_number"
                                                            class="form-control" onkeypress="return isNumber()"
                                                            id="phone_number" required="required" pattern="[۰-۹]*[0-9]*"
                                                            title="یوازې نمبر داخل کړئ" />
                                                        <div style="color:red"> {{ $errors->first('phone_number') }}</div>
                                                    </div>

                                                </div>

                                            </div>

                                            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 pull-right">

                                                <div class="form-group form-group-sm  ">
                                                    <label for="house_no">کور نمبر</label>
                                                    <input type="text" value="{{ $edit_owner->house_no }}"
                                                        name="house_no" class="form-control"
                                                        onkeypress="return isNumber()" id="house_no" pattern="[0-9]*"
                                                        title="یوازې نمبر داخل کړئ" />
                                                </div>
                                                <div class="form-group form-group-sm">
                                                    <label for="description">توضیحات<span style="color: red"> *
                                                        </span></label>
                                                    <textarea class="form-control" rows="11" placeholder="توضیحات" name="description" required="required"
                                                        id="description">{{ $edit_owner->description }}</textarea>
                                                    <div style="color:red"> {{ $errors->first('description') }}</div>
                                                </div>

                                            </div>

                                            <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">
                                                <h5 class="text-center">د مالک اصلی سکونت</h5>
                                                <div class="form-group form-group-sm">
                                                    <label for="pro">ولایت</label>
                                                    <select class="form-control" id="per_pro_id"
                                                        name="permenant_prov_add">
                                                        <option value="{{ $edit_owner->permenant_prov_add }}">
                                                            {{ $edit_owner->per_province->name }}</option>
                                                        @foreach ($provinces as $province)
                                                            <option value="{{ $province->id }}">{{ $province->name }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                                <div class="form-group form-group-sm">
                                                    <label for="pro">ولسوالي</label>
                                                    <select class="form-control" id="permenant_dis_add"
                                                        name="permenant_dist_add">
                                                        <option value="{{ $edit_owner->permenant_dist_add }}">
                                                            {{ $edit_owner->per_disrict->name }}</option>
                                                    </select>
                                                </div>
                                                <div class="form-group form-group-sm">
                                                    <label for="permenant_village">کلی</label>
                                                    <input type="text" name="permenant_village"
                                                        value="{{ $edit_owner->permenant_village }}" class="form-control"
                                                        id="vil"
                                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                                        title="یوازې الفبا توري داخل کړئ" />
                                                </div>
                                                <h5 class="text-center">د مالک فعلی سکونت</h5>

                                                <div class="form-group form-group-sm">
                                                    <label for="pro">ولایت</label>
                                                    <select class="form-control" id="cur_pro_id"
                                                        name="current_prov_add" />
                                                    <option value="{{ $edit_owner->current_prov_add }}">
                                                        {{ $edit_owner->cur_province->name }}</option>
                                                    @foreach ($cur_provinces as $province)
                                                        <option value="{{ $province->id }}">{{ $province->name }}
                                                        </option>
                                                    @endforeach
                                                    </select>
                                                </div>
                                                <div class="form-group form-group-sm">
                                                    <label for="pro">ولسوالي</label>
                                                    <select class="form-control" id="current_dis_add"
                                                        name="current_dis_add">
                                                        <option value="{{ $edit_owner->current_dist_add }}">
                                                            {{ $edit_owner->cur_district->name }}</option>
                                                    </select>
                                                </div>
                                                <div class="form-group form-group-sm">
                                                    <label for="current_village">کلی</label>
                                                    <input type="text" name="current_village"
                                                        value="{{ $edit_owner->current_village }}" class="form-control"
                                                        id="current_village"
                                                        pattern="[A-Za-z\s]*[۰آاأبپتټثجحخچڅځدذډرزؤړوږښسشصضطظعغفقکګلمنڼږهءیيېئۍ\s]*"
                                                        title="یوازې الفبا توري داخل کړئ" />
                                                </div>
                                            </div>

                                        </div>
                                        <h5 class="text-center"> عکس اپلوډ &nbsp;<i id="show_documents"
                                                class="fa fa-plus"></i></h5>
                                        <hr />
                                        <div id="frm" class="row">
                                            <div class="col-lg-4 col-mg-6 col-sm-12 col-xs-12">
                                                <div class="form-group form-group-sm">
                                                    <label for="image">د مالک عکس<span style="color: red"> *
                                                        </span></label>
                                                    <input class="form-control" type="file"
                                                        value="{{ $edit_owner->image }}" onchange="loadFile(event)"
                                                        name="image" id="image" />
                                                </div>

                                                <div class="form-group form-group-sm text-center">
                                                    <img id="output"
                                                        src="{{ asset('upload/owner/image/' . $edit_owner->image) }}"
                                                        id="selected_img" alt="Preview" height="100"
                                                        width="87" />
                                                </div>
                                            </div>


                                        </div>

                                </div>
                                <div class="text-left">
                                    <input type="submit" class="btn btn-default btn-md" id="submit" value="تغیر کول"
                                        name="submit" />
                                    <a href="{{ route('owner.index') }}" class="btn btn-default btn-md">واپس تلل</a>
                                </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
                <!-- /.nav-tabs-custom -->
            </div>
            <!-- /.col -->
        </div>
        <!-- /.row -->
        </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->

@section('pageJs')

    <script>
        $("#per_pro_id").change(function() {
            var province_id = $(this).val();
            // alert(province_id);
            $.ajax({
                url: '/ajax/fill_per_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'province_id': province_id
                },
                success: function(data) {
                    $('#permenant_dis_add').html(data);
                    // alert(data);

                },
                error: function() {
                    alert('error');
                }
            });
        });



        $("#cur_pro_id").change(function() {
            var cur_pro_id = $(this).val();
            $.ajax({
                url: '/ajax/fill_cur_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'cur_pro_id': cur_pro_id
                },
                success: function(data) {
                    $('#current_dis_add').html(data);
                    // alert(data);
                },
                error: function() {
                    alert('error');
                }
            });
        });

        $(document).ready(function() {
            $("#print").click(function() {
                var mode = 'iframe';
                var close = mode == 'popup';
                var options = {
                    mode: mode,
                    popClose: close
                };
                $('div.printTable').printArea(options);
            });
        });
    </script>

@endsection












@endsection
