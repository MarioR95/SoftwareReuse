package it.unisa.javat.visitor;

public enum NodeType {
	  // Field descriptor #6 I
	  ANONYMOUS_CLASS_DECLARATION(1),
	  
	  // Field descriptor #6 I
	  ARRAY_ACCESS(2),
	  
	  // Field descriptor #6 I
	  ARRAY_CREATION(3),
	  
	  // Field descriptor #6 I
	  ARRAY_INITIALIZER(4),
	  
	  // Field descriptor #6 I
	  ARRAY_TYPE(5),
	  
	  // Field descriptor #6 I
	  ASSERT_STATEMENT(6),
	  
	  // Field descriptor #6 I
	  ASSIGNMENT(7),
	  
	  // Field descriptor #6 I
	  BLOCK(8),
	  
	  // Field descriptor #6 I
	  BOOLEAN_LITERAL(9),
	  
	  // Field descriptor #6 I
	  BREAK_STATEMENT(10),
	  
	  // Field descriptor #6 I
	  CAST_EXPRESSION(11),
	  
	  // Field descriptor #6 I
	  CATCH_CLAUSE(12),
	  
	  // Field descriptor #6 I
	  CHARACTER_LITERAL(13),
	  
	  // Field descriptor #6 I
	  CLASS_INSTANCE_CREATION(14),
	  
	  // Field descriptor #6 I
	  COMPILATION_UNIT(15),
	  
	  // Field descriptor #6 I
	  CONDITIONAL_EXPRESSION(16),
	  
	  // Field descriptor #6 I
	  CONSTRUCTOR_INVOCATION(17),
	  
	  // Field descriptor #6 I
	  CONTINUE_STATEMENT(18),
	  
	  // Field descriptor #6 I
	  DO_STATEMENT(19),
	  
	  // Field descriptor #6 I
	  EMPTY_STATEMENT(20),
	  
	  // Field descriptor #6 I
	  EXPRESSION_STATEMENT(21),
	  
	  // Field descriptor #6 I
	  FIELD_ACCESS(22),
	  
	  // Field descriptor #6 I
	  FIELD_DECLARATION(23),
	  
	  // Field descriptor #6 I
	  FOR_STATEMENT(24),
	  
	  // Field descriptor #6 I
	  IF_STATEMENT(25),
	  
	  // Field descriptor #6 I
	  IMPORT_DECLARATION(26),
	  
	  // Field descriptor #6 I
	  INFIX_EXPRESSION(27),
	  
	  // Field descriptor #6 I
	  INITIALIZER(28),
	  
	  // Field descriptor #6 I
	  JAVADOC(29),
	  
	  // Field descriptor #6 I
	  LABELED_STATEMENT(30),
	  
	  // Field descriptor #6 I
	  METHOD_DECLARATION(31),
	  
	  // Field descriptor #6 I
	  METHOD_INVOCATION(32),
	  
	  // Field descriptor #6 I
	  NULL_LITERAL(33),
	  
	  // Field descriptor #6 I
	  NUMBER_LITERAL(34),
	  
	  // Field descriptor #6 I
	  PACKAGE_DECLARATION(35),
	  
	  // Field descriptor #6 I
	  PARENTHESIZED_EXPRESSION(36),
	  
	  // Field descriptor #6 I
	  POSTFIX_EXPRESSION(37),
	  
	  // Field descriptor #6 I
	  PREFIX_EXPRESSION(38),
	  
	  // Field descriptor #6 I
	  PRIMITIVE_TYPE(39),
	  
	  // Field descriptor #6 I
	  QUALIFIED_NAME(40),
	  
	  // Field descriptor #6 I
	  RETURN_STATEMENT(41),
	  
	  // Field descriptor #6 I
	  SIMPLE_NAME(42),
	  
	  // Field descriptor #6 I
	  SIMPLE_TYPE(43),
	  
	  // Field descriptor #6 I
	  SINGLE_VARIABLE_DECLARATION(44),
	  
	  // Field descriptor #6 I
	  STRING_LITERAL(45),
	  
	  // Field descriptor #6 I
	  SUPER_CONSTRUCTOR_INVOCATION(46),
	  
	  // Field descriptor #6 I
	  SUPER_FIELD_ACCESS(47),
	  
	  // Field descriptor #6 I
	  SUPER_METHOD_INVOCATION(48),
	  
	  // Field descriptor #6 I
	  SWITCH_CASE(49),
	  
	  // Field descriptor #6 I
	  SWITCH_STATEMENT(50),
	  
	  // Field descriptor #6 I
	  SYNCHRONIZED_STATEMENT(51),
	  
	  // Field descriptor #6 I
	  THIS_EXPRESSION(52),
	  
	  // Field descriptor #6 I
	  THROW_STATEMENT(53),
	  
	  // Field descriptor #6 I
	  TRY_STATEMENT(54),
	  
	  // Field descriptor #6 I
	  TYPE_DECLARATION(55),
	  
	  // Field descriptor #6 I
	  TYPE_DECLARATION_STATEMENT(56),
	  
	  // Field descriptor #6 I
	  TYPE_LITERAL(57),
	  
	  // Field descriptor #6 I
	  VARIABLE_DECLARATION_EXPRESSION(58),
	  
	  // Field descriptor #6 I
	  VARIABLE_DECLARATION_FRAGMENT(59),
	  
	  // Field descriptor #6 I
	  VARIABLE_DECLARATION_STATEMENT(60),
	  
	  // Field descriptor #6 I
	  WHILE_STATEMENT(61),
	  
	  // Field descriptor #6 I
	  INSTANCEOF_EXPRESSION(62),
	  
	  // Field descriptor #6 I
	  LINE_COMMENT(63),
	  
	  // Field descriptor #6 I
	  BLOCK_COMMENT(64),
	  
	  // Field descriptor #6 I
	  TAG_ELEMENT(65),
	  
	  // Field descriptor #6 I
	  TEXT_ELEMENT(66),
	  
	  // Field descriptor #6 I
	  MEMBER_REF(67),
	  
	  // Field descriptor #6 I
	  METHOD_REF(68),
	  
	  // Field descriptor #6 I
	  METHOD_REF_PARAMETER(69),
	  
	  // Field descriptor #6 I
	  ENHANCED_FOR_STATEMENT(70),
	  
	  // Field descriptor #6 I
	  ENUM_DECLARATION(71),
	  
	  // Field descriptor #6 I
	  ENUM_CONSTANT_DECLARATION(72),
	  
	  // Field descriptor #6 I
	  TYPE_PARAMETER(73),
	  
	  // Field descriptor #6 I
	  PARAMETERIZED_TYPE(74),
	  
	  // Field descriptor #6 I
	  QUALIFIED_TYPE(75),
	  
	  // Field descriptor #6 I
	  WILDCARD_TYPE(76),
	  
	  // Field descriptor #6 I
	  NORMAL_ANNOTATION(77),
	  
	  // Field descriptor #6 I
	  MARKER_ANNOTATION(78),
	  
	  // Field descriptor #6 I
	  SINGLE_MEMBER_ANNOTATION(79),
	  
	  // Field descriptor #6 I
	  MEMBER_VALUE_PAIR(80),
	  
	  // Field descriptor #6 I
	  ANNOTATION_TYPE_DECLARATION(81),
	  
	  // Field descriptor #6 I
	  ANNOTATION_TYPE_MEMBER_DECLARATION(82),
	  
	  // Field descriptor #6 I
	  MODIFIER(83),
	  
	  // Field descriptor #6 I
	  UNION_TYPE(84),
	  
	  // Field descriptor #6 I
	  DIMENSION(85),
	  
	  // Field descriptor #6 I
	  LAMBDA_EXPRESSION(86),
	  
	  // Field descriptor #6 I
	  INTERSECTION_TYPE(87),
	  
	  // Field descriptor #6 I
	  NAME_QUALIFIED_TYPE(88),
	  
	  // Field descriptor #6 I
	  CREATION_REFERENCE(89),
	  
	  // Field descriptor #6 I
	  EXPRESSION_METHOD_REFERENCE(90),
	  
	  // Field descriptor #6 I
	  SUPER_METHOD_REFERENCE(91),
	  
	  // Field descriptor #6 I
	  TYPE_METHOD_REFERENCE(92);
	  
	  private int _type;
		
		private NodeType(int type)
		{
			_type = type;
		}
		
		public int getIntValue()
		{
			return _type;
		}	  
}
