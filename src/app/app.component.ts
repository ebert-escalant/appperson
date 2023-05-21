import { Component, OnInit } from '@angular/core';
import { PersonService } from './services/person.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	data: any[] = [];
	currentPage: number = 1;
	prevPage: number = 1;
	nextPage: number = 1;
	lastPage: number = 1;
	visiblePages: number[] = [];
	form!: FormGroup;
	formAction: string = 'insert';
	editId: string = '';
	buttonText: string = 'Agregar';
    from: number = 1;
    to: number = 1;
    total: number = 1;

	constructor(private personService: PersonService, private toastr: ToastrService) {
		this.form = new FormBuilder().group({
			dni: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
			name: ['', Validators.required],
			lastName: ['', Validators.required],
			birthdate: ['', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]]
		})
	}

	get dni() { return this.form.controls['dni']; }
	get name() { return this.form.controls['name']; }
	get lastName() { return this.form.controls['lastName']; }
	get birthdate() { return this.form.controls['birthdate']; }

	ngOnInit() {
		this.loadData(this.currentPage)
	}

	updateVisiblePages() {
		const totalPages = this.lastPage;
		const currentPage = this.currentPage;

		const startPage = Math.max(1, currentPage - 2);
		const endPage = Math.min(totalPages, currentPage + 2);

		this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	}

	loadData(page: number) {
		this.personService.all(page).subscribe((response: any) => {
			this.data = response.data;
			this.currentPage = response.current_page;
			this.lastPage = response.last_page;
			this.prevPage = response.prev_page_url ? response.prev_page_url.split('page=')[1] : 1;
			this.nextPage = response.next_page_url ? response.next_page_url.split('page=')[1] : 1;
            this.from = response.from;
            this.to = response.to;
            this.total = response.total;
			this.updateVisiblePages();
		})
	}

	prev() {
		this.loadData(this.prevPage);
	}

	next() {
		this.loadData(this.nextPage);
	}

	onSubmitForm(){
		if(this.formAction == 'insert'){
			this.saveData();
		}else{
			this.updateData(this.editId);
		}
	}

	saveData() {
		console.log(this.birthdate.value);
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			Object.keys(this.form.controls).forEach(key => {
				this.form.controls[key].markAsDirty();
			})

			this.toastr.error('Please, fill all the fields');
			return;
		}

		const data = {
			dni: this.dni.value,
			name: this.name.value,
			last_name: this.lastName.value,
			birthdate: this.birthdate.value
		}

		this.personService.insert(data).subscribe((response: any) => {
			this.toastr.success(response.message);
			this.loadData(this.currentPage);
			this.form.reset();
		})
	}

	editData(id: string) {
		this.personService.getById(id).subscribe((response: any) => {
			this.dni.setValue(response.dni);
			this.name.setValue(response.name);
			this.lastName.setValue(response.last_name);
			this.birthdate.setValue(response.birthdate);
			this.formAction = 'update';
			this.editId = id;
			this.buttonText = 'Actualizar';
		})
	}

	updateData(id: string) {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			Object.keys(this.form.controls).forEach(key => {
				this.form.controls[key].markAsDirty();
			})

			this.toastr.error('Please, fill all the fields');
			return;
		}

		const data = {
			dni: this.dni.value,
			name: this.name.value,
			last_name: this.lastName.value,
			birthdate: this.birthdate.value
		}

		this.personService.update(id, data).subscribe((response: any) => {
			this.toastr.success(response.message);
			this.loadData(this.currentPage);
			this.form.reset();
			this.formAction = 'insert';
			this.buttonText = 'Agregar';
			this.editId = '';
		})
	}

	deleteData(id: string) {
		this.personService.delete(id).subscribe((response: any) => {
			this.toastr.success(response.message);
			this.loadData(this.currentPage);
		})
	}
}
