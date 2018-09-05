package it.unisa.javat.visitor;

import java.util.Stack;

import org.eclipse.jdt.core.dom.IBinding;

public class Scope {
	ScopeType _type;
	Stack<IBinding> _bindings = new Stack<>();

	public Scope(ScopeType type) {
		_type = type;
	}
	
	public void push(IBinding element) {
		_bindings.push(element);
	}

	public IBinding pop() {
		if (_bindings.size() > 0)
			return _bindings.pop();

		return null;
	}

	public IBinding top() {
		if (_bindings.size() > 0)
			return _bindings.lastElement();

		return null;
	}

	public Stack<IBinding> getBindings() {
		return _bindings;
	}

	public String toString() {
		return _type.name();
	}
}
